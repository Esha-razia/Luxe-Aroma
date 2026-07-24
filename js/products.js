/**
 * Luxe Aroma - Products Database
 * Contains local perfume catalog with rich metadata, descriptions, sizes, and customer reviews.
 */

window.LUXE_PRODUCTS = [
    {
        id: 1,
        name: "Oud-e-Khas",
        brand: "Luxe Aroma House",
        price: 4500,
        rating: 4.9,
        reviewCount: 124,
        collection: "Arabian Collection",
        gender: "unisex",
        image: "images/perfume_arabian.png",
        description: "An opulent, mysterious blend of premium Cambodian oud, dark wood resins, and soft Damascus rose. Oud-e-Khas encapsulates the timeless heritage of royal Eastern perfumery, offering an intense, warm scent trail that commands presence and elegance.",
        details: "Top Notes: Saffron, Nutmeg\nHeart Notes: Damask Rose, Patchouli\nBase Notes: Cambodian Oud, Amber, Sandalwood\nLongevity: Extremely Long-lasting (12+ hours)\nSillage: Strong",
        ingredients: "Alcohol Denat., Fragrance (Parfum), Aquilaria Agallocha (Oud) Wood Oil, Aqua (Water), Linalool, Limonene, Benzyl Salicylate, Coumarin, Eugenol, Citronellol.",
        reviews: [
            { author: "Zayd Khan", rating: 5, text: "The richest Oud I have ever experienced. Absolutely hypnotic, lasts for days on my clothes.", date: "July 2, 2026", avatar: "https://i.pravatar.cc/100?img=33" },
            { author: "Layla Malik", rating: 5, text: "A masterpiece. Balanced perfectly with rose. Pure luxury in a bottle.", date: "June 28, 2026", avatar: "https://i.pravatar.cc/100?img=47" },
            { author: "Sarah Pervez", rating: 4, text: "Stunning bottle design and deep warm aroma. Very strong, ideal for evening wear.", date: "May 15, 2026", avatar: "https://i.pravatar.cc/100?img=1" }
        ],
        isBestSeller: true,
        isNewArrival: false,
        discount: 10 // percentage
    },
    {
        id: 2,
        name: "Gulab-e-Bahar",
        brand: "Luxe Aroma House",
        price: 3800,
        rating: 4.8,
        reviewCount: 98,
        collection: "Floral Collection",
        gender: "women",
        image: "images/perfume_french.png",
        description: "A bright, elegant floral bouquet featuring fresh Jasmine, sweet Red Rose, and a touch of sparkling Mandarin. Gulab-e-Bahar is the epitome of classical elegance, offering a fresh yet deeply luxurious fragrance profile that feels like a stroll through a blooming garden in spring.",
        details: "Top Notes: Mandarin Orange, Bergamot\nHeart Notes: Grasse Jasmine, Centifolia Rose\nBase Notes: White Musk, Patchouli\nLongevity: Long-lasting (8-10 hours)\nSillage: Moderate",
        ingredients: "Alcohol, Fragrance, Aqua, Linalool, Benzyl Salicylate, Limonene, Hexyl Cinnamal, Geraniol, Citronellol, Coumarin, Citral.",
        reviews: [
            { author: "Sobia Bibi", rating: 5, text: "Light, floral, and incredibly elegant. It makes me feel instantly sophisticated. My daily signature scent.", date: "July 12, 2026", avatar: "https://i.pravatar.cc/100?img=20" },
            { author: "Emma Riaz", rating: 5, text: "Simply gorgeous. The jasmine note is fresh and authentic. Never fails to deliver.", date: "June 10, 2026", avatar: "https://i.pravatar.cc/100?img=23" }
        ],
        isBestSeller: true,
        isNewArrival: false,
        discount: 0
    },
    {
        id: 3,
        name: "Kasturi Musk",
        brand: "Luxe Aroma House",
        price: 4200,
        rating: 4.7,
        reviewCount: 84,
        collection: "Arabian Collection",
        gender: "unisex",
        image: "images/perfume_floral.png",
        description: "An intoxicatingly rich musk perfume that blends rare white musk with soft coffee notes, spicy cardamom, and a base of deep vanilla. Kasturi Musk is a sensual, bold reimagining of classic musky fragrances, designed for those who command distinction.",
        details: "Top Notes: Cardamom, Coffee, Pink Pepper\nHeart Notes: Royal White Musk, Bulgarian Rose\nBase Notes: Madagascar Vanilla, Patchouli, Sandalwood\nLongevity: Long-lasting (8-12 hours)\nSillage: Moderate to Strong",
        ingredients: "Alcohol Denat., Water, Fragrance, Citronellol, Geraniol, Linalool, Limonene, Citral, Benzyl Alcohol, Benzyl Benzoate, Eugenol.",
        reviews: [
            { author: "Isabella G.", rating: 5, text: "A dark, mysterious rose. The coffee undertone gives it a phenomenal edge. Worth every single rupee.", date: "June 14, 2026", avatar: "https://i.pravatar.cc/100?img=36" },
            { author: "Muhammad Salman", rating: 4, text: "Bought this for my wife, but I occasionally wear it myself. A beautiful spicy musk scent.", date: "May 29, 2026", avatar: "https://i.pravatar.cc/100?img=12" }
        ],
        isBestSeller: false,
        isNewArrival: true,
        discount: 0
    },
    {
        id: 4,
        name: "Dastaan",
        brand: "Luxe Aroma House",
        price: 4600,
        rating: 4.8,
        reviewCount: 156,
        collection: "French Collection",
        gender: "men",
        image: "images/perfume_men.png",
        description: "A charismatic, fresh woody fragrance combining aromatic Mediterranean citrus with rich, masculine cedarwood and incense notes. Dastaan represents the strength of character, expressing freedom, refinement, and bold sensuality.",
        details: "Top Notes: Grapefruit, Lemon, Mint\nHeart Notes: Cedarwood, Jasmine, Ginger\nBase Notes: Incense, Vetiver, Sandalwood, Patchouli\nLongevity: Long-lasting (8-10 hours)\nSillage: Moderate",
        ingredients: "Alcohol, Aqua, Parfum, Limonene, Linalool, Citronellol, Citral, Coumarin, Geraniol, Benzyl Benzoate.",
        reviews: [
            { author: "Dawood Hashmi", rating: 5, text: "The perfect balance of fresh citrus and smokey woodiness. It is universally loved. Amazing compliment-getter.", date: "July 8, 2026", avatar: "https://i.pravatar.cc/100?img=59" },
            { author: "Jamil Latif", rating: 5, text: "My absolute favorite go-to fragrance. Masculine, deep, and clean. Ten out of ten.", date: "July 1, 2026", avatar: "https://i.pravatar.cc/100?img=68" }
        ],
        isBestSeller: true,
        isNewArrival: false,
        discount: 0
    },
    {
        id: 5,
        name: "Suroor",
        brand: "Luxe Aroma House",
        price: 4800,
        rating: 4.9,
        reviewCount: 62,
        collection: "Arabian Collection",
        gender: "unisex",
        image: "images/perfume_arabian.png",
        description: "An incredibly smooth, clean, and luxurious fragrance celebrating the purity of royal spices. Infused with soft white floral extracts, sweet vanilla, and warm cedarwood, it leaves an ethereal, powdery trail.",
        details: "Top Notes: White Lily, Violet\nHeart Notes: Warm Cardamom, Rose\nBase Notes: Cedarwood, Vanilla, Sandalwood\nLongevity: Long-lasting (10+ hours)\nSillage: Soft to Moderate",
        ingredients: "Alcohol Denat., Aqua (Water), Fragrance (Parfum), Alpha-Isomethyl Ionone, Coumarin, Benzyl Alcohol, Benzyl Salicylate, Hydroxycitronellal.",
        reviews: [
            { author: "Aisha Ahmed", rating: 5, text: "The cleanest spice blend I have ever smelled. It has a beautiful, elegant powdery finish that lasts all day.", date: "June 25, 2026", avatar: "https://i.pravatar.cc/100?img=49" },
            { author: "Tariq Farooq", rating: 5, text: "Outstanding quality. Soft, warm, and highly comforting. Very sophisticated.", date: "May 18, 2026", avatar: "https://i.pravatar.cc/100?img=53" }
        ],
        isBestSeller: false,
        isNewArrival: true,
        discount: 15
    },
    {
        id: 6,
        name: "Haya",
        brand: "Luxe Aroma House",
        price: 3500,
        rating: 4.6,
        reviewCount: 74,
        collection: "Floral Collection",
        gender: "women",
        image: "images/perfume_women.png",
        description: "A private spring garden captured in a crystal vial. Haya weaves together the soft essence of cherry blossoms, iris petals, and fresh green leaves, finishing with a warm, subtle base of cedarwood.",
        details: "Top Notes: Cherry Blossom, Ivy Leaves\nHeart Notes: Iris, Magnolia, Lily of the Valley\nBase Notes: Sandalwood, Ambergris, White Musk\nLongevity: Moderate (6-8 hours)\nSillage: Soft",
        ingredients: "Alcohol, Water (Aqua), Fragrance (Parfum), Hexyl Cinnamal, Linalool, Hydroxycitronellal, Limonene, Geraniol, Citral.",
        reviews: [
            { author: "Kiran Riaz", rating: 5, text: "It smells like early morning dew on spring flowers. Incredibly refreshing and pure.", date: "June 19, 2026", avatar: "https://i.pravatar.cc/100?img=19" },
            { author: "Noman Shah", rating: 4, text: "Very pleasant floral fragrance. Gifted it to my mother and she absolutely adores it.", date: "May 2, 2026", avatar: "https://i.pravatar.cc/100?img=15" }
        ],
        isBestSeller: false,
        isNewArrival: true,
        discount: 0
    },
    {
        id: 7,
        name: "Shahi Darbar",
        brand: "Luxe Aroma House",
        price: 4900,
        rating: 4.9,
        reviewCount: 110,
        collection: "Arabian Collection",
        gender: "unisex",
        image: "images/perfume_floral.png",
        description: "A sweet, rich, and addictive fragrance revolving around dark amber and saffron. Enriched with honey, warm spices, and premium sandalwood elements, Shahi Darbar offers a truly regal olfactory experience.",
        details: "Top Notes: Amber, Honey\nHeart Notes: Tobacco Blossom, Royal Saffron\nBase Notes: Tonka Bean, Sandalwood, Dried Fruits\nLongevity: Extremely Long-lasting (12+ hours)\nSillage: Strong",
        ingredients: "Alcohol Denat., Fragrance (Parfum), Water\\Aqua\\Eau, Coumarin, Benzyl Alcohol, Benzyl Benzoate, Linalool, Eugenol.",
        reviews: [
            { author: "Safia Malik", rating: 5, text: "This is the king of amber fragrances. Warm, gourmand, slightly smoky, and absolutely addictive.", date: "July 11, 2026", avatar: "https://i.pravatar.cc/100?img=43" },
            { author: "Moin Dar", rating: 5, text: "A phenomenal fragrance for colder weather. It projects brilliantly and gathers endless compliments.", date: "June 30, 2026", avatar: "https://i.pravatar.cc/100?img=9" }
        ],
        isBestSeller: true,
        isNewArrival: false,
        discount: 0
    },
    {
        id: 8,
        name: "Dilkash",
        brand: "Luxe Aroma House",
        price: 3900,
        rating: 4.7,
        reviewCount: 43,
        collection: "French Collection",
        gender: "men",
        image: "images/perfume_men.png",
        description: "An invigorating blast of fresh citrus, featuring Calabrian bergamot and bitter orange, layered over a sophisticated base of spicy vetiver and white pepper.",
        details: "Top Notes: Calabrian Bergamot, Sicilian Lemon, Bitter Orange\nHeart Notes: White Pepper, Pink Pepper, Vetiver\nBase Notes: Amberwood, Oakmoss, Patchouli\nLongevity: Moderate to Long (7-9 hours)\nSillage: Moderate",
        ingredients: "Alcohol, Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citronellol, Citral, Coumarin, Geraniol.",
        reviews: [
            { author: "Nasir Waheed", rating: 5, text: "Perfect summer perfume! Extremely clean, zesty, and classy. Incredibly refreshing.", date: "July 14, 2026", avatar: "https://i.pravatar.cc/100?img=3" },
            { author: "Urooj S.", rating: 4, text: "Bought this for my brother. It smells amazing, fresh and masculine. Longevity is decent.", date: "July 5, 2026", avatar: "https://i.pravatar.cc/100?img=5" }
        ],
        isBestSeller: false,
        isNewArrival: true,
        discount: 20
    }
];
