from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/proposal/', views.ProposalCreateListView.as_view(), name='proposal-create-list'),
    path('api/v1/proposal/<int:pk>/', views.ProposalRetrieveUpdateDestroyView.as_view(), name='proposal-detail-view'),
    path('api/v1/proposal/table/operation/<int:pk>/', views.ProposalByOperationListView.as_view(), name='proposal-by-operation-view'),
    path('api/v1/proposal/filter/', views.ProposalByADEAPIView.as_view(), name='proposal-filter-view'),
    path('api/v1/proposal/values/', views.ProposalValuesAPIView.as_view(), name='proposal-values-view'),
    path('api/v1/proposal/export/', views.ProposalExportAPIView.as_view(), name='proposal-export-view'),

    path('api/v1/proposals/<int:proposal_id>/upload/', views.ProposalFileUploadView.as_view(), name='proposal_upload_file'),
    path('api/v1/proposals/<int:proposal_id>/files/', views.ProposalFileListView.as_view(), name='proposal_list_files'),

    path('proposal/list/', views.ProposalListView.as_view(), name='proposal_list'),
    path('proposal/create/', views.ProposalCreateView.as_view(), name='proposal_create'),
    path('proposal/corretor/', views.ProposalEsteiraCorretor.as_view(), name='proposal_corretor'),

    path('proposal/create/portabilidade+refin', views.ProposalPortabilidadeCreateView.as_view(), name='proposal_create_portabilidade_refin'),
    path('proposal/create/margem_livre', views.ProposalMargemCreateView.as_view(), name='proposal_create_margem_livre'),
    path('proposal/create/refinanciamento', views.ProposalRefinanciamentoCreateView.as_view(), name='proposal_create_refinanciamento'),
    path('proposal/create/portabilidade', views.ProposalPortabilidadePuraCreateView.as_view(), name='proposal_create_portabilidade'),
    path('proposal/create/refin_port_pos', views.ProposalRefinPortPosCreateView.as_view(), name='proposal_create_refin_port_pos'),
    path('proposal/create/fgts', views.ProposalFGTSCreateView.as_view(), name='proposal_create_fgts'),
    path('proposal/create/emprestimo', views.ProposalEmprestimoPessoalCreateView.as_view(), name='proposal_create_emprestimo'),
    path('proposal/create/rmc', views.ProposalRMCCreateView.as_view(), name='proposal_create_rmc'),
    path('proposal/create/rcc', views.ProposalRCCCreateView.as_view(), name='proposal_create_rcc'),

    path('proposal/create/saque_rmc', views.ProposalSaqueRMCCreateView.as_view(), name='proposal_create_saque_rmc'),
    path('proposal/create/saque_rcc', views.ProposalSaqueRCCCreateView.as_view(), name='proposal_create_saque_rcc'),

    path('proposal/proposals/operacional/', views.ProposalEsteiraOperacional.as_view(), name='proposals_operacional'),
    path('proposal/proposals/operacional/port/', views.ProposalEsteiraOperacionalPort.as_view(), name='proposals_operacional_port'),
    path('proposal/proposals/operacional/list/', views.ProposalListOperacional.as_view(), name='proposals_operacional_list'),
    path('proposal/proposals/operacional/fisicos/list/', views.ProposalIsDeliveredLisOperacional.as_view(), name='proposals_is_delivered_list'),
    path('proposal/<int:pk>/update/', views.ProposalUpdateView.as_view(), name='proposal_update'),
    path('proposal/<int:pk>/detail/', views.ProposalDetailView.as_view(), name='proposal_detail'),
    path('proposal/export/', views.ProposalExporTemplateView.as_view(), name='proposal_export'),
]
