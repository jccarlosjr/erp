from django.contrib.auth.mixins import AccessMixin
from django.core.exceptions import PermissionDenied


class UserRoleRequiredMixin(AccessMixin):
    allowed_roles = []  # Lista de papéis permitidos (deve ser sobrescrita pela View)

    def dispatch(self, request, *args, **kwargs):
        # Verifica se o usuário está autenticado
        if not request.user.is_authenticated:
            return self.handle_no_permission()

        # Verifica se o usuário tem um dos papéis permitidos
        if request.user.role not in self.allowed_roles:
            raise PermissionDenied("Você não tem permissão para acessar esta página.")

        return super().dispatch(request, *args, **kwargs)
