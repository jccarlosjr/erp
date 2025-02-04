from django.db import models


class Customer(models.Model):
    name = models.CharField(max_length=200)
    cpf = models.CharField(max_length=14, unique=False)
    birthdate = models.DateField()
    sex = models.CharField(max_length=10)
    is_foreigner = models.CharField(max_length=10, null=True, blank=True)
    email = models.EmailField(blank=True, null=True)
    is_illiterate = models.CharField(max_length=10, null=True, blank=True)
    rg = models.CharField(max_length=100)
    rg_public_agency = models.CharField(max_length=20)
    rg_uf = models.CharField(max_length=20)
    rg_created_date = models.DateField()
    naturality_city = models.CharField(max_length=50)
    naturality_uf = models.CharField(max_length=20)
    father = models.CharField(max_length=200)
    mother = models.CharField(max_length=200)
    telphone = models.CharField(max_length=15)
    celphone = models.CharField(max_length=15)
    postal_code = models.CharField(max_length=10)
    city = models.CharField(max_length=200)
    city_state = models.CharField(max_length=20)
    district = models.CharField(max_length=200)
    place = models.CharField(max_length=200)
    complement = models.CharField(max_length=100)
    house_number = models.CharField(max_length=20)
    agency_id = models.IntegerField()
    agency = models.CharField(max_length=10)
    agency_code = models.CharField(max_length=200)
    agency_uf = models.CharField(max_length=20)
    agency_is_cm = models.CharField(max_length=3)
    income = models.FloatField()
    account_type = models.CharField(max_length=10)
    account_bank = models.CharField(max_length=200)
    account_agency = models.IntegerField()
    account = models.IntegerField()
    account_dv = models.IntegerField()
    is_representated = models.CharField(max_length=10, default="NÃO")
    rep_cpf = models.CharField(max_length=14, null=True, blank=True)
    rep_name = models.CharField(max_length=200, null=True, blank=True)

    def save(self, *args, **kwargs):
        """Sobrescreve o método save para garantir atualizações com base no CPF."""
        if not self.pk:
            existing_customer = Customer.objects.filter(cpf=self.cpf).first()
            if existing_customer:
                for field in self._meta.fields:
                    if field.name != 'id':
                        setattr(existing_customer, field.name, getattr(self, field.name))
                existing_customer.save()
                return
        super(Customer, self).save(*args, **kwargs)

    def __str__(self):
        return self.name
