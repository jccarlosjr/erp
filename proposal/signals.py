from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import Proposal

# @receiver(pre_save, sender=Proposal)
# def create_history_on_status_change(sender, instance, **kwargs):

#     if instance.pk:
#         try:
#             old_proposal = Proposal.objects.get(pk=instance.pk)
#         except Proposal.DoesNotExist:
#             old_proposal = None

#         if old_proposal and old_proposal.status != instance.status:
#             History.objects.create(
#                 proposal=instance,
#                 user=instance.user,
#                 status=instance.status,
#                 obs=""
#             )

@receiver(post_save, sender=Proposal)
def cancel_linked_proposals(sender, instance, **kwargs):
    if instance.status in ['14', '15']:
        linked_proposals = Proposal.objects.filter(bound_proposal=instance)

        for proposal in linked_proposals:
            proposal.status = instance.status
            proposal.save(update_fields=['status'])

    

@receiver(post_save, sender=Proposal)
def calculate_cms(sender, instance, **kwargs):
    if instance.status in ['11', '12', '15'] and instance.table:
        table = instance.table
        cms_value = float(table.cms) / 100 if table.cms else 0

        if table.cms_type == "bruto":
            new_cms = instance.total_amount * cms_value
        elif table.cms_type == "liquido":
            new_cms = instance.exchange * cms_value
        else:
            return 
        Proposal.objects.filter(id=instance.id).update(cms=new_cms)