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
      { id: 'auto-insurance', desc: 'Auto Insurance' },
      { id: 'tuition', desc: 'Tuition' },
      { id: 'jobs', desc: 'Jobs' },
      { id: 'life-insurance', desc: 'Life Insurance' },
      { id: 'marriage', desc: 'Marriage' },
      { id: 'house', desc: 'Buy a House' },
      { id: 'fire-insurance', desc: 'Fire Insurance' },
      { id: 'taxes1', desc: 'Taxes 1' },
      { id: 'stock-insurance', desc: 'Stock Insurance' },
      { id: 'taxes2', desc: 'Taxes 2' },
      { id: 'taxes3', desc: 'Taxes 3' },
      { id: 'orphanage', desc: 'Help an Orphanage' },
      { id: 'toll-bridge', desc: 'Toll Bridge' },
      { id: 'property-taxes', desc: 'Property Taxes' },
      { id: 'day-of-reckoning', desc: 'Day of Reckoning' },
      { id: 'millionaire', desc: 'Millionaire' }
    ]
  };
});