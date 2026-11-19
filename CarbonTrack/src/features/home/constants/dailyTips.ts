// Mẹo giảm phát thải cho thẻ Daily Tip, mỗi mẹo kèm 1 ảnh Unsplash (miễn phí, có ghi credit).
// Số liệu khớp với hệ số trong backend EmissionService.

export interface DailyTip {
  title: string;
  text: string;
  photo: {
    id: string;        // phần sau "photo-" trên images.unsplash.com
    author: string;
    pageUrl: string;   // trang ảnh trên Unsplash (để ghi credit)
  };
}

export const DAILY_TIPS: DailyTip[] = [
  {
    title: "Take the bus",
    text: "Taking the bus instead of a car cuts about 0.12 kg CO₂ per km — that's 1.2 kg on a 10 km commute.",
    photo: {
      id: "1513836279014-a89f7a76ae86",
      author: "Casey Horner",
      pageUrl: "https://unsplash.com/photos/low-angle-photography-of-trees-at-daytime-4rDCa5hBlCs",
    },
  },
  {
    title: "Go meat-free today",
    text: "1 kg of red meat emits ~27 kg CO₂, vegetarian food only ~2 kg. One veggie day makes a real dent.",
    photo: {
      id: "1542601906990-b4d3fb778b09",
      author: "Noah Buscher",
      pageUrl: "https://unsplash.com/photos/hands-holding-small-plant-seedling-in-soil-x8ZStukS2PM",
    },
  },
  {
    title: "Unplug idle devices",
    text: "Standby power can be ~10% of home electricity. Switch off at the wall — every kWh saved is ~0.5 kg CO₂.",
    photo: {
      id: "1594818379496-da1e345b0ded",
      author: "Anders J",
      pageUrl: "https://unsplash.com/photos/white-and-blue-solar-panels-hxUcl0nUsIY",
    },
  },
  {
    title: "Choose renewable energy",
    text: "If your provider offers a green plan, switching is the single biggest cut you can make to home emissions.",
    photo: {
      id: "1675116731363-c17d957f3444",
      author: "Zac Wolff",
      pageUrl: "https://unsplash.com/photos/a-field-of-green-grass-with-wind-turbines-in-the-background-baXCV2qg9Ew",
    },
  },
  {
    title: "Buy second-hand",
    text: "A new piece of clothing is ~10 kg CO₂. Pre-loved or repaired items skip most of that.",
    photo: {
      id: "1679110667877-408593fab0f6",
      author: "Jennifer Delmarre",
      pageUrl: "https://unsplash.com/photos/a-person-holding-a-plant-in-their-hands-IqmuHJF5khU",
    },
  },
  {
    title: "Shorter showers",
    text: "Cutting your shower by 2 minutes saves water and the energy to heat it — small habit, daily win.",
    photo: {
      id: "1528122819723-9dca3a31295d",
      author: "Tobias Weinhold",
      pageUrl: "https://unsplash.com/photos/person-showing-green-leaf-hXPomXrpUP0",
    },
  },
  {
    title: "Walk short trips",
    text: "Trips under 2 km are perfect on foot or by bike: zero emissions and a free workout.",
    photo: {
      id: "1440342359743-84fcb8c21f21",
      author: "kazuend",
      pageUrl: "https://unsplash.com/photos/worms-eye-view-of-forest-during-day-time-19SC2oaVZW0",
    },
  },
  {
    title: "Keep your electronics longer",
    text: "Making a new phone or laptop emits ~60 kg CO₂. Repairing and keeping it another year is the greenest choice.",
    photo: {
      id: "1597150899069-efb9c8c6010c",
      author: "Vlad Hilitanu",
      pageUrl: "https://unsplash.com/photos/green-trees-on-the-forest-during-daytime-QqSIuvz94s8",
    },
  },
];

/** Link ảnh đã resize (Unsplash CDN). */
export const tipImageUrl = (id: string, width = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&q=70&auto=format&fit=crop`;

/** UTM theo yêu cầu ghi nguồn của Unsplash. */
export const UNSPLASH_UTM = "?utm_source=carbontrack&utm_medium=referral";
