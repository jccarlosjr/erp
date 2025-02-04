from django.db.models.signals import post_migrate
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import Group
from .models import CustomUser


@receiver(post_migrate)
def create_groups_and_permissions(sender, **kwargs):
    """ Cria os grupos e atribui as permissões após as migrações """
    if sender.name != "accounts":
        return

    groups_permissions = {
        "Vendedor": [
            "bank|bank|view_bank",
            "company|company|view_company",
            "company|room|view_room",
            "customer|customer|add_customer",
            "customer|customer|change_customer",
            "customer|customer|view_customer",
            "history|history|add_history",
            "history|history|change_history",
            "history|history|view_history",
            "operation|operation|view_operation",
            "proposal|proposal|add_proposal",
            "proposal|proposal|change_proposal",
            "proposal|proposal|view_proposal",
            "table|table|view_table",
        ],
        "Supervisor": [
            "bank|bank|view_bank",
            "company|company|view_company",
            "company|room|add_room",
            "company|room|change_room",
            "company|room|view_room",
            "customer|customer|add_customer",
            "customer|customer|change_customer",
            "customer|customer|view_customer",
            "history|history|add_history",
            "history|history|change_history",
            "history|history|view_history",
            "operation|operation|view_operation",
            "proposal|proposal|add_proposal",
            "proposal|proposal|change_proposal",
            "proposal|proposal|view_proposal",
            "table|table|view_table",
        ],
        "Gestor": [
            "accounts|customuser|add_customuser",
            "accounts|customuser|change_customuser",
            "accounts|customuser|view_customuser",
            "bank|bank|view_bank",
            "company|company|view_company",
            "company|room|add_room",
            "company|room|change_room",
            "company|room|view_room",
            "customer|customer|add_customer",
            "customer|customer|change_customer",
            "customer|customer|view_customer",
            "history|history|add_history",
            "history|history|change_history",
            "history|history|view_history",
            "operation|operation|view_operation",
            "proposal|proposal|add_proposal",
            "proposal|proposal|change_proposal",
            "proposal|proposal|view_proposal",
            "table|table|view_table",
        ],
        "Operacional": [
            "accounts|customuser|add_customuser",
            "accounts|customuser|change_customuser",
            "accounts|customuser|view_customuser",
            "bank|bank|add_bank",
            "bank|bank|change_bank",
            "bank|bank|view_bank",
            "company|company|view_company",
            "company|room|add_room",
            "company|room|change_room",
            "company|room|view_room",
            "customer|customer|add_customer",
            "customer|customer|change_customer",
            "customer|customer|view_customer",
            "history|history|add_history",
            "history|history|change_history",
            "history|history|view_history",
            "operation|operation|view_operation",
            "proposal|proposal|add_proposal",
            "proposal|proposal|change_proposal",
            "proposal|proposal|view_proposal",
            "table|table|add_table",
            "table|table|delete_table",
            "table|table|change_table",
            "table|table|view_table",
        ],
        "Administrador": [
            "accounts|customuser|add_customuser",
            "accounts|customuser|change_customuser",
            "accounts|customuser|view_customuser",
            "bank|bank|add_bank",
            "bank|bank|change_bank",
            "bank|bank|delete_bank",
            "bank|bank|view_bank",
            "company|company|add_company",
            "company|company|delete_company",
            "company|company|change_company",
            "company|company|view_company",
            "company|room|add_room",
            "company|room|delete_room",
            "company|room|change_room",
            "company|room|view_room",
            "customer|customer|add_customer",
            "customer|customer|delete_customer",
            "customer|customer|change_customer",
            "customer|customer|view_customer",
            "history|history|add_history",
            "history|history|delete_history",
            "history|history|change_history",
            "history|history|view_history",
            "operation|operation|view_operation",
            "proposal|proposal|add_proposal",
            "proposal|proposal|delete_proposal",
            "proposal|proposal|change_proposal",
            "proposal|proposal|view_proposal",
            "table|table|add_table",
            "table|table|delete_table",
            "table|table|change_table",
            "table|table|view_table",
        ]
    }

    for group_name, permissions_list in groups_permissions.items():
        group, created = Group.objects.get_or_create(name=group_name)
        if created:
            print(f"Grupo '{group_name}' criado com sucesso!")

        for permission_str in permissions_list:
            try:
                app_label, model, codename = permission_str.split("|")
                content_type = ContentType.objects.get(app_label=app_label.lower(), model=model.lower())
                permission = Permission.objects.get(content_type=content_type, codename=codename.lower())
                group.permissions.add(permission)
            except Exception as e:
                print(f"Ocorreu um erro ao adicionar a permissão '{permission_str}': {e}")
