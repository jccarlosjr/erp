import csv
from datetime import datetime
from django.core.management.base import BaseCommand
from customer.models import Customer

class Command(BaseCommand):
    help = 'Importa clientes de um arquivo CSV para o banco de dados'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Caminho do arquivo CSV')

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']

        try:
            with open(csv_file, newline='', encoding='utf-8') as file:
                # Use the correct delimiter (';') here
                reader = csv.DictReader(file, delimiter=';')
                customers = []
                for row in reader:
                    try:
                        birthdate_str = row.get('birthdate', '').strip()
                        rg_created_date_default = datetime.strptime('10/10/2010', "%d/%m/%Y").date()
                        if birthdate_str:
                            try:
                                birthdate = datetime.strptime(birthdate_str, "%d/%m/%Y").date()
                            except ValueError:
                                self.stderr.write(f'Erro ao converter data de nascimento {birthdate_str} na linha {row}. Usando valor nulo.')
                        
                        customer = Customer(
                            agency=row.get('agency', ''),  
                            cpf=row.get('cpf', ''),  
                            name=row.get('name', ''),  
                            email=row.get('email', ''),  
                            celphone=row.get('celphone', ''),  
                            city=row.get('city', ''),  
                            agency_id=int(row.get('agency_id', 0)),  
                            birthdate=birthdate,  
                            sex='F',  
                            is_foreigner='NÃO',  
                            is_illiterate='NÃO',  
                            rg='',  
                            rg_public_agency='',  
                            rg_uf='',  
                            rg_created_date=rg_created_date_default,  
                            naturality_city='',  
                            naturality_uf='',  
                            father='',  
                            mother='',  
                            telphone='',  
                            postal_code='',  
                            city_state='',  
                            district='',  
                            place='',  
                            complement='',  
                            house_number='',  
                            agency_code='',  
                            agency_uf='',  
                            agency_is_cm='NÃO',  
                            income=0.0,  
                            account_type='',  
                            account_bank='',  
                            account_agency=0,  
                            account=0,  
                            account_dv=0,  
                            is_representated='NÃO',  
                            rep_cpf='',  
                            rep_name='',  
                        )
                        customers.append(customer)

                    except Exception as e:
                        pass
                        # self.stderr.write(f'Erro ao processar linha {row}: {e}')

                # Salva todos os clientes no banco de dados
                if customers:
                    Customer.objects.bulk_create(customers)
                    self.stdout.write(self.style.SUCCESS(f'{len(customers)} clientes importados com sucesso!'))
                else:
                    self.stdout.write(self.style.WARNING('Nenhum cliente foi importado.'))

        except FileNotFoundError:
            self.stderr.write(self.style.ERROR(f'Arquivo "{csv_file}" não encontrado.'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Ocorreu um erro ao processar o arquivo: {e}'))
