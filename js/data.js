define( /* Data */
["jquery"],
function($) {

  return {
    insurance: {
      auto: { price: 1000 },
      life: { price: 10000 },
      fire: { price: 10000 },
      stock: { price: 50000 }
    },
    jobs: [
      {name:"d", desc:"Doctor", salary:50000, summary:"is a Doctor"},
      {name:"j", desc:"Journalist", salary:24000, summary:"is a Journalist"},
      {name:"l", desc:"Lawyer", salary:50000, summary:"is a Lawyer"},
      {name:"t", desc:"Teacher", salary:20000, summary:"is a Teacher"},
      {name:"p", desc:"Physicist", salary:30000, summary:"is a Physicist"},
      {name:"u", desc:"University", salary:16000, summary:"is a University Student"},
      {name:"b", desc:"Business", salary:12000, summary:"has a Business Degree"}
    ],
    spaces: [
      'auto-insurance',
      'tuition',
      'jobs',
      'life-insurance',
      'marriage',
      'house',
      'fire-insurance',
      'taxes1',
      'stock-insurance',
      'taxes2',
      'taxes3',
      'orphanage',
      'toll-bridge',
      'property-taxes',
      'day-of-reckoning',
      'millionaire'
    ]
  };
});