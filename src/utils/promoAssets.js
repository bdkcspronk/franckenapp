// GENERATED FILE - DO NOT EDIT
// Run scripts/generate-promo-assets.js to regenerate.

const promos = {
  '1': [ require('../../assets/promo/1.pdf') ],
  '10': [ require('../../assets/promo/10.pdf') ],
  '12': [ require('../../assets/promo/12_13.pdf') ],
  '13': [ require('../../assets/promo/12_13.pdf') ],
  '3': [ require('../../assets/promo/3.pdf') ],
  '4': [ require('../../assets/promo/4.pdf') ],
  '5': [ require('../../assets/promo/5.pdf') ],
  '7': [ require('../../assets/promo/7.pdf') ],
  '9': [ require('../../assets/promo/9.pdf') ],
  'news': [ require('../../assets/promo/news.pdf') ],
};

export function getPromosForEventId(id) { return promos[id] || []; }
export default getPromosForEventId;
