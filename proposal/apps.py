from django.apps import AppConfig

class ProposalConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'proposal'

    def ready(self):
        import proposal.signals
