from typing import Any
from rest_framework import generics
from .models import Proposal
from django.urls import reverse_lazy
from .serializers import ProposalSerializer, ProposalDetailSerializer, ProposalADESerializer, ProposalFinancialSerializer
from rest_framework.permissions import IsAuthenticated
from app.permissions import GlobalDefaultPermission
from django.contrib.auth.mixins import LoginRequiredMixin
from accounts.mixins import UserRoleRequiredMixin
from django.views.generic import TemplateView, ListView, UpdateView, DetailView
from .forms import ProposalForm
from django.db.models import Sum
from .models import STATUS_CHOICES
from datetime import timedelta
from rest_framework.response import Response
from django.utils.dateparse import parse_date
from django.utils import timezone
from django.db.models import Q
from django.shortcuts import redirect
from django.contrib import messages



class ProposalCreateListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Proposal.objects.all()

    def get_queryset(self):
        user = self.request.user
        date_threshold = timezone.now().date() - timedelta(days=90)

        base_queryset = super().get_queryset().filter(last_update__gte=date_threshold).order_by('-id')

        if user.role == 'vendedor':
            return base_queryset.filter(user=user)
        elif user.role == 'supervisor':
            return base_queryset.filter(user__room=user.room)
        elif user.role == 'gestor':
            return base_queryset.filter(user__company=user.room)
        elif user.role in ['operacional', 'admin']:
            return base_queryset.filter(user__company=user.company)
        else:
            return Proposal.objects.none()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProposalDetailSerializer
        return ProposalSerializer


class ProposalByOperationListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    serializer_class = ProposalSerializer
    queryset = Proposal.objects.all()

    def get_queryset(self):
        operation_id = self.kwargs.get('pk')
        date_threshold = timezone.now().date() - timedelta(days=90)

        return Proposal.objects.filter(table__operation__id=operation_id, last_update__gte=date_threshold).order_by('-id')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProposalDetailSerializer
        return ProposalSerializer


class ProposalByADEAPIView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    serializer_class = ProposalADESerializer
    queryset = Proposal.objects.all()

    def get_queryset(self):
        ade = self.request.GET.get('ade')
        internal_code = self.request.GET.get('internal_code')
        cpf = self.request.GET.get('cpf')

        if cpf:
            return Proposal.objects.filter(cpf=cpf).order_by('-id')
        if internal_code:
            return Proposal.objects.filter(internal_code=internal_code).order_by('-id')
        if ade:
            return Proposal.objects.filter(ade=ade).order_by('-id')
        return Proposal.objects.none()


class ProposalValuesAPIView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ProposalFinancialSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Proposal.objects.all()

        if user.role == "vendedor":
            queryset = queryset.filter(user=user)
        elif user.role == "supervisor":
            queryset = queryset.filter(user__room=user.room)
        elif user.role == "gestor":
            queryset = queryset.filter(user__company=user.room)
        elif user.role in ["operacional", "admin"]:
            queryset = queryset.filter(user__company=user.company)
        else:
            return Proposal.objects.none()

        return queryset

    def get(self, request, *args, **kwargs):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        status = request.query_params.get("status")
        user = request.query_params.get("user")
        room = request.query_params.get("room")

        start_date = parse_date(start_date) if start_date else None
        end_date = parse_date(end_date) if end_date else None

        if start_date and end_date:
            if start_date > end_date:
                return Response({"error": "A data inicial não pode ser maior que a data final."}, status=400)

            max_range = timedelta(days=31)
            if end_date - start_date > max_range:
                return Response({"error": "O intervalo de datas não pode exceder 31 dias."}, status=400)

        queryset = self.get_queryset()

        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)

        if status:
            queryset = queryset.filter(status=status)

        if room:
            queryset = queryset.filter(user__room=room)

        if user:
            queryset = queryset.filter(user__username=user)

        total_amount = queryset.aggregate(Sum("total_amount"))["total_amount__sum"] or 0
        exchange = queryset.aggregate(Sum("exchange"))["exchange__sum"] or 0
        cms = queryset.aggregate(Sum("cms"))["cms__sum"] or 0
        proposals_data = self.get_serializer(queryset, many=True).data

        return Response({
            "total_amount_sum": total_amount,
            "exchange_sum": exchange,
            "cms": cms,
            "proposals": proposals_data
        })


class ProposalExportAPIView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ProposalDetailSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Proposal.objects.all()

        if user.role == "vendedor":
            queryset = queryset.filter(user=user)
        elif user.role == "supervisor":
            queryset = queryset.filter(user__room=user.room)
        elif user.role == "gestor":
            queryset = queryset.filter(user__company=user.room)
        elif user.role in ["operacional", "admin"]:
            queryset = queryset.filter(user__company=user.company)
        else:
            return Proposal.objects.none()

        return queryset

    def get(self, request, *args, **kwargs):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        status = request.query_params.get("status")
        user = request.query_params.get("user")
        room = request.query_params.get("room")

        start_date = parse_date(start_date) if start_date else None
        end_date = parse_date(end_date) if end_date else None

        if start_date and end_date:
            if start_date > end_date:
                return Response({"error": "A data inicial não pode ser maior que a data final."}, status=400)

            max_range = timedelta(days=31)
            if end_date - start_date > max_range:
                return Response({"error": "O intervalo de datas não pode exceder 31 dias."}, status=400)

        queryset = self.get_queryset()

        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)

        if status:
            queryset = queryset.filter(status=status)

        if room:
            queryset = queryset.filter(user__room=room)

        if user:
            queryset = queryset.filter(user__username=user)

        total_amount = queryset.aggregate(Sum("total_amount"))["total_amount__sum"] or 0
        exchange = queryset.aggregate(Sum("exchange"))["exchange__sum"] or 0
        cms = queryset.aggregate(Sum("cms"))["cms__sum"] or 0
        proposals_data = self.get_serializer(queryset, many=True).data

        return Response({
            "total_amount_sum": total_amount,
            "exchange_sum": exchange,
            "cms": cms,
            "proposals": proposals_data
        })


class ProposalRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Proposal.objects.all()
    serializer_class = ProposalSerializer


class ProposalCreateView(LoginRequiredMixin, TemplateView):
    template_name = 'proposal_create.html'


class ProposalMargemCreateView(LoginRequiredMixin, TemplateView):
    template_name = 'proposal_create_margem_livre.html'


class ProposalRefinanciamentoCreateView(LoginRequiredMixin, TemplateView):
    template_name = 'proposal_create_refinanciamento.html'


class ProposalRMCCreateView(LoginRequiredMixin, TemplateView):
    template_name = 'proposal_create_rmc.html'


class ProposalRCCCreateView(LoginRequiredMixin, TemplateView):
    template_name = 'proposal_create_rcc.html'


class ProposalSaqueRMCCreateView(LoginRequiredMixin, TemplateView):
    template_name = 'proposal_create_saque_rmc.html'


class ProposalSaqueRCCCreateView(LoginRequiredMixin, TemplateView):
    template_name = 'proposal_create_saque_rcc.html'


class ProposalPortabilidadeCreateView(LoginRequiredMixin, TemplateView):
    template_name = 'proposal_create_portabilidade_refin.html'


class ProposalPortabilidadePuraCreateView(LoginRequiredMixin, TemplateView):
    template_name = 'proposal_create_portabilidade_pura.html'


class ProposalRefinPortPosCreateView(LoginRequiredMixin, TemplateView):
    template_name = 'proposal_create_refin_port_pos.html'


class ProposalFGTSCreateView(LoginRequiredMixin, TemplateView):
    template_name = 'proposal_create_fgts.html'


class ProposalEmprestimoPessoalCreateView(LoginRequiredMixin, TemplateView):
    template_name = 'proposal_create_emprestimo_pessoal.html'


class ProposalListView(LoginRequiredMixin, ListView):
    model = Proposal
    template_name = 'proposal_list.html'
    context_object_name = 'proposals'
    paginate_by = 25

    def get_queryset(self):
        user = self.request.user
        proposals = Proposal.objects.none()

        if user.role == 'vendedor':
            proposals = Proposal.objects.filter(user=user)
        elif user.role == 'supervisor':
            proposals = Proposal.objects.filter(user__room=user.room)
        elif user.role in ['gestor', 'operacional', 'admin']:
            proposals = Proposal.objects.filter(user__company=user.company)

        proposals = proposals.order_by('-id')

        search_type = self.request.GET.get('search_type', '').strip()
        search_value = self.request.GET.get('search_value', '').strip()

        if search_type and search_value:
            filters = Q()

            if search_type == 'cpf':
                filters &= Q(cpf=search_value)
            elif search_type == 'name':
                filters &= Q(name__icontains=search_value)
            elif search_type == 'internal_code':
                filters &= Q(internal_code=search_value)
            elif search_type == 'bank':
                filters &= Q(table__bank__name__icontains=search_value)
            elif search_type == 'operation':
                filters &= Q(table__operation__name__icontains=search_value)
            elif search_type == 'celphone':
                filters &= Q(celphone__icontains=search_value)
            elif search_type == 'rep_cpf':
                filters &= Q(rep_cpf=search_value)
            elif search_type == 'rep_name':
                filters &= Q(rep_name__icontains=search_value)
            elif search_type == 'ade':
                filters &= Q(ade__icontains=search_value)
            proposals = proposals.filter(filters)

        return proposals


class ProposalDetailView(LoginRequiredMixin, DetailView):
    model = Proposal
    template_name = 'proposal_detail.html'


class ProposalEsteiraCorretor(LoginRequiredMixin, TemplateView):
    template_name = 'proposal_corretor.html'


class ProposalEsteiraOperacionalPort(UserRoleRequiredMixin, LoginRequiredMixin, TemplateView):
    template_name = 'proposals_operacional_port.html'
    allowed_roles = ['operacional', 'admin']


class ProposalEsteiraOperacional(UserRoleRequiredMixin, LoginRequiredMixin, TemplateView):
    template_name = 'proposals_operacional.html'
    allowed_roles = ['operacional', 'admin']


class ProposalListOperacional(UserRoleRequiredMixin, LoginRequiredMixin, ListView):
    model = Proposal
    template_name = 'proposals_operacional_list.html'
    context_object_name = 'proposals'
    paginate_by = 25
    allowed_roles = ['operacional', 'admin']

    def get_queryset(self):
        user = self.request.user
        proposals = Proposal.objects.none()

        if user.role == 'vendedor':
            proposals = Proposal.objects.filter(user=user)
        elif user.role == 'supervisor':
            proposals = Proposal.objects.filter(user__room=user.room)
        elif user.role in ['gestor', 'operacional', 'admin']:
            proposals = Proposal.objects.filter(user__company=user.company)

        proposals = proposals.order_by('-id')

        search_type = self.request.GET.get('search_type', '').strip()
        search_value = self.request.GET.get('search_value', '').strip()

        if search_type and search_value:
            filters = Q()

            if search_type == 'cpf':
                filters &= Q(cpf=search_value)
            elif search_type == 'name':
                filters &= Q(name__icontains=search_value)
            elif search_type == 'internal_code':
                filters &= Q(internal_code=search_value)
            elif search_type == 'bank':
                filters &= Q(table__bank__name__icontains=search_value)
            elif search_type == 'operation':
                filters &= Q(table__operation__name__icontains=search_value)
            elif search_type == 'user':
                filters &= Q(user__username=search_value)
            elif search_type == 'username':
                filters &= Q(user__first_name__icontains=search_value)
            elif search_type == 'celphone':
                filters &= Q(celphone__icontains=search_value)
            elif search_type == 'rep_cpf':
                filters &= Q(rep_cpf=search_value)
            elif search_type == 'rep_name':
                filters &= Q(rep_name__icontains=search_value)
            elif search_type == 'ade':
                filters &= Q(ade__icontains=search_value)
            proposals = proposals.filter(filters)

        return proposals


class ProposalUpdateView(LoginRequiredMixin, UpdateView):
    model = Proposal
    template_name = 'proposal_update.html'
    form_class = ProposalForm
    success_url = reverse_lazy('proposal_list')

    def dispatch(self, request, *args, **kwargs):
        proposal = self.get_object()
        if proposal.is_blocked:
            messages.error(request, "Esta proposta está bloqueada e não pode ser editada.")
            return redirect('proposal_list')
        return super().dispatch(request, *args, **kwargs)



class ProposalIsDeliveredLisOperacional(UserRoleRequiredMixin, LoginRequiredMixin, ListView):
    model = Proposal
    template_name = 'proposals_is_delivered_list.html'
    context_object_name = 'proposals'
    paginate_by = 25
    allowed_roles = ['operacional', 'admin']

    def get_queryset(self):
        user = self.request.user
        proposals = Proposal.objects.none()

        if user.role == 'vendedor':
            proposals = Proposal.objects.filter(user=user)
        elif user.role == 'supervisor':
            proposals = Proposal.objects.filter(user__room=user.room)
        elif user.role in ['gestor', 'operacional', 'admin']:
            proposals = Proposal.objects.filter(user__company=user.company)

        proposals = proposals.filter(is_delivered=False).order_by('-id')

        search_type = self.request.GET.get('search_type', '').strip()
        search_value = self.request.GET.get('search_value', '').strip()

        if search_type and search_value:
            filters = Q()

            if search_type == 'cpf':
                filters &= Q(cpf=search_value)
            elif search_type == 'name':
                filters &= Q(name__icontains=search_value)
            elif search_type == 'internal_code':
                filters &= Q(internal_code=search_value)
            elif search_type == 'bank':
                filters &= Q(table__bank__name__icontains=search_value)
            elif search_type == 'operation':
                filters &= Q(table__operation__name__icontains=search_value)
            elif search_type == 'user':
                filters &= Q(user__username=search_value)
            elif search_type == 'username':
                filters &= Q(user__first_name__icontains=search_value)
            elif search_type == 'celphone':
                filters &= Q(celphone__icontains=search_value)
            elif search_type == 'rep_cpf':
                filters &= Q(rep_cpf=search_value)
            elif search_type == 'rep_name':
                filters &= Q(rep_name__icontains=search_value)
            elif search_type == 'ade':
                filters &= Q(ade__icontains=search_value)
            proposals = proposals.filter(filters)

        return proposals


class ProposalExporTemplateView(UserRoleRequiredMixin, LoginRequiredMixin, TemplateView):
    template_name = 'proposals_export.html'
    allowed_roles = ['operacional', 'admin']
