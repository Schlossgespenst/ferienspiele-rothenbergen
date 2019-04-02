export default {
  baseUrl: 'https://ferienspiele-rothenbergen.de',
  apiUrl: 'https://us-central1-ferienspiele-rothenbergen-2.cloudfunctions.net',
  title: 'Helden des Alltags',
  year: 2019,
  startDate: new Date('2019-07-01'),
  endDate: new Date('2019-07-05'),
  registrationStart: new Date('2019-04-04'),
  registrationDeadline: new Date('2019-06-01'),
  waiverDeadline: new Date('2019-06-15'),
  maxParticipants: 45,
  prices: {
    base: 35,
    sibling: -10,
    noCake: 10,
  },
  kuchen: [
    { date: '2019-07-01', amount: 10 },
    { date: '2019-07-02', amount: 10 },
    { date: '2019-07-03', amount: 10 },
    { date: '2019-07-04', amount: 10 },
  ],
  genders: [{ value: 'm', label: 'männlich' }, { value: 'f', label: 'weiblich' }, { value: 'd', label: 'divers' }],
  shirtSizes: [
    { value: 'WOMEN_XS', label: 'Damen XS' },
    { value: 'WOMEN_S', label: 'Damen S' },
    { value: 'WOMEN_M', label: 'Damen M' },
    { value: 'WOMEN_L', label: 'Damen L' },
    { value: 'WOMEN_XL', label: 'Damen XL' },
    { value: 'WOMEN_XXL', label: 'Damen XXL' },
    { value: 'MEN_XS', label: 'Herren XS' },
    { value: 'MEN_S', label: 'Herren S' },
    { value: 'MEN_M', label: 'Herren M' },
    { value: 'MEN_L', label: 'Herren L' },
    { value: 'MEN_XL', label: 'Herren XL' },
    { value: 'MEN_XXL', label: 'Herren XXL' },
    { value: 'MEN_XXXL', label: 'Herren XXXL falls verfügbar, sonst XXL' },
    { value: 'CHILDREN_S', label: 'Kinder 7-8 Jahre (122/128)' },
    { value: 'CHILDREN_M', label: 'Kinder 9-11 Jahre (134/146)' },
    { value: 'CHILDREN_L', label: 'Kinder 12-14 Jahre (152/164)' },
  ],
};
