/**
 * Luxe Aroma - Products Database
 * Contains local perfume catalog with rich metadata, descriptions, sizes, and customer reviews.
 */

window.LUXE_PRODUCTS = [
    {
        id: 1,
        name: "Oud Royale",
        brand: "Arabian Oud",
        price: 180,
        rating: 4.9,
        reviewCount: 124,
        collection: "Arabian Collection",
        gender: "unisex",
        image: "images/perfume_arabian.png",
        description: "An opulent, mysterious blend of premium Cambodian oud, dark wood resins, and soft Damascus rose. Oud Royale encapsulates the timeless heritage of Middle Eastern perfumery, offering an intense, warm scent trail that commands presence and elegance.",
        details: "Top Notes: Saffron, Nutmeg\nHeart Notes: Damask Rose, Patchouli\nBase Notes: Cambodian Oud, Amber, Sandalwood\nLongevity: Extremely Long-lasting (12+ hours)\nSillage: Strong",
        ingredients: "Alcohol Denat., Fragrance (Parfum), Aquilaria Agallocha (Oud) Wood Oil, Aqua (Water), Linalool, Limonene, Benzyl Salicylate, Coumarin, Eugenol, Citronellol.",
        reviews: [
            { author: "Zayd K.", rating: 5, text: "The richest Oud I have ever experienced. Absolutely hypnotic, lasts for days on my coats.", date: "July 2, 2026", avatar: "https://i.pravatar.cc/100?img=33" },
            { author: "Layla M.", rating: 5, text: "A masterpiece. Balanced perfectly with rose. Pure luxury in a bottle.", date: "June 28, 2026", avatar: "https://i.pravatar.cc/100?img=47" },
            { author: "Sarah P.", rating: 4, text: "Stunning bottle design and deep warm aroma. Very strong, ideal for evening wear.", date: "May 15, 2026", avatar: "https://i.pravatar.cc/100?img=1" }
        ],
        isBestSeller: true,
        isNewArrival: false,
        discount: 10 // percentage
    },
    {
        id: 2,
        name: "La Fleur d'Or",
        brand: "Dior",
        price: 145,
        rating: 4.8,
        reviewCount: 98,
        collection: "French Collection",
        gender: "women",
        image: "images/perfume_french.png",
        description: "A bright, elegant floral bouquet featuring Grasse Jasmine, May Rose, and a touch of sparkling Mandarin. La Fleur d'Or is the epitome of French sophistication, offering a fresh yet deeply luxurious fragrance profile that feels like a stroll through a blooming garden in spring.",
        details: "Top Notes: Mandarin Orange, Bergamot\nHeart Notes: Grasse Jasmine, Centifolia Rose\nBase Notes: White Musk, Patchouli\nLongevity: Long-lasting (8-10 hours)\nSillage: Moderate",
        ingredients: "Alcohol, Fragrance, Aqua, Linalool, Benzyl Salicylate, Limonene, Hexyl Cinnamal, Geraniol, Citronellol, Coumarin, Citral.",
        reviews: [
            { author: "Sophie B.", rating: 5, text: "Light, floral, and incredibly elegant. It makes me feel instantly sophisticated. My daily signature scent.", date: "July 12, 2026", avatar: "https://i.pravatar.cc/100?img=20" },
            { author: "Emma R.", rating: 5, text: "Simply gorgeous. The jasmine note is fresh and authentic. Dior never fails to deliver.", date: "June 10, 2026", avatar: "https://i.pravatar.cc/100?img=23" }
        ],
        isBestSeller: true,
        isNewArrival: false,
        discount: 0
    },
    {
        id: 3,
        name: "Rose Absolute",
        brand: "Tom Ford",
        price: 220,
        rating: 4.7,
        reviewCount: 84,
        collection: "Floral Collection",
        gender: "women",
        image: "images/perfume_floral.png",
        description: "An intoxicatingly rich rose perfume that blends rare Turkish rose absolute with dark coffee notes, spicy cardamom, and a base of deep vanilla. Rose Absolute is a sensual, bold reimagining of classic floral fragrances, designed for those who dare to stand out.",
        details: "Top Notes: Cardamom, Coffee, Pink Pepper\nHeart Notes: Turkish Rose, Bulgarian Rose\nBase Notes: Madagascar Vanilla, Patchouli, Sandalwood\nLongevity: Long-lasting (8-12 hours)\nSillage: Moderate to Strong",
        ingredients: "Alcohol Denat., Water, Fragrance, Citronellol, Geraniol, Linalool, Limonene, Citral, Benzyl Alcohol, Benzyl Benzoate, Eugenol.",
        reviews: [
            { author: "Isabella G.", rating: 5, text: "A dark, mysterious rose. The coffee undertone gives it a phenomenal edge. Worth every single penny.", date: "June 14, 2026", avatar: "https://i.pravatar.cc/100?img=36" },
            { author: "Michael S.", rating: 4, text: "Bought this for my wife, but I occasionally wear it myself. A beautiful spicy rose scent.", date: "May 29, 2026", avatar: "https://i.pravatar.cc/100?img=12" }
        ],
        isBestSeller: false,
        isNewArrival: true,
        discount: 0
    },
    {
        id: 4,
        name: "Noir Intense",
        brand: "Chanel",
        price: 135,
        rating: 4.8,
        reviewCount: 156,
        collection: "Men Collection",
        gender: "men",
        image: "images/perfume_men.png",
        description: "A charismatic, fresh woody fragrance combining aromatic Mediterranean citrus with rich, masculine cedar and incense notes. Noir Intense represents the strength of modern character, expressing freedom, refinement, and bold sensuality in a glossy dark bottle.",
        details: "Top Notes: Grapefruit, Lemon, Mint\nHeart Notes: Cedarwood, Jasmine, Ginger\nBase Notes: Incense, Vetiver, Sandalwood, Patchouli\nLongevity: Long-lasting (8-10 hours)\nSillage: Moderate",
        ingredients: "Alcohol, Aqua, Parfum, Limonene, Linalool, Citronellol, Citral, Coumarin, Geraniol, Benzyl Benzoate.",
        reviews: [
            { author: "David H.", rating: 5, text: "The perfect balance of fresh citrus and smokey woodiness. It is universally loved. Amazing compliment-getter.", date: "July 8, 2026", avatar: "https://i.pravatar.cc/100?img=59" },
            { author: "James L.", rating: 5, text: "My absolute favorite go-to fragrance. Masculine, deep, and clean. Ten out of ten.", date: "July 1, 2026", avatar: "https://i.pravatar.cc/100?img=68" }
        ],
        isBestSeller: true,
        isNewArrival: false,
        discount: 0
    },
    {
        id: 5,
        name: "Elixir of Musk",
        brand: "Arabian Oud",
        price: 195,
        rating: 4.9,
        reviewCount: 62,
        collection: "Arabian Collection",
        gender: "unisex",
        image: "images/perfume_arabian.png",
        description: "An incredibly smooth, clean, and luxurious fragrance celebrating the purity of Royal White Musk. Infused with soft white floral extracts, sweet vanilla, and warm cedarwood, it leaves an ethereal, powdery trail that feels like second skin.",
        details: "Top Notes: White Lily, Violet\nHeart Notes: White Musk, Rose\nBase Notes: Cedarwood, Vanilla, Powdery Notes\nLongevity: Long-lasting (10+ hours)\nSillage: Soft to Moderate",
        ingredients: "Alcohol Denat., Aqua (Water), Fragrance (Parfum), Alpha-Isomethyl Ionone, Coumarin, Benzyl Alcohol, Benzyl Salicylate, Hydroxycitronellal.",
        reviews: [
            { author: "Aisha A.", rating: 5, text: "The cleanest musk I have ever smelled. It has a beautiful, elegant powdery finish that lasts all day.", date: "June 25, 2026", avatar: "https://i.pravatar.cc/100?img=49" },
            { author: "Tariq F.", rating: 5, text: "Outstanding quality. Soft, warm, and highly comforting. Very sophisticated.", date: "May 18, 2026", avatar: "https://i.pravatar.cc/100?img=53" }
        ],
        isBestSeller: false,
        isNewArrival: true,
        discount: 15
    },
    {
        id: 6,
        name: "Jardin Secret",
        brand: "Chanel",
        price: 160,
        rating: 4.6,
        reviewCount: 74,
        collection: "French Collection",
        gender: "women",
        image: "images/perfume_women.png",
        description: "A private garden captured in a crystal vial. Jardin Secret weaves together the soft essence of cherry blossoms, iris petals, and fresh green ivy, finishing with a warm, subtle base of cedarwood and ambergris.",
        details: "Top Notes: Cherry Blossom, Ivy Leaves\nHeart Notes: Iris, Magnolia, Lily of the Valley\nBase Notes: Sandalwood, Ambergris, White Musk\nLongevity: Moderate (6-8 hours)\nSillage: Soft",
        ingredients: "Alcohol, Water (Aqua), Fragrance (Parfum), Hexyl Cinnamal, Linalool, Hydroxycitronellal, Limonene, Geraniol, Citral.",
        reviews: [
            { author: "Chloe V.", rating: 5, text: "It smells like early morning dew on spring flowers. Incredibly refreshing and pure.", date: "June 19, 2026", avatar: "https://i.pravatar.cc/100?img=19" },
            { author: "Liam T.", rating: 4, text: "Very pleasant floral fragrance. Gifted it to my mother and she absolutely adores it.", date: "May 2, 2026", avatar: "https://i.pravatar.cc/100?img=15" }
        ],
        isBestSeller: false,
        isNewArrival: true,
        discount: 0
    },
    {
        id: 7,
        name: "Vanilla Velvet",
        brand: "Tom Ford",
        price: 250,
        rating: 4.9,
        reviewCount: 110,
        collection: "Floral Collection",
        gender: "unisex",
        image: "images/perfume_floral.png",
        description: "A sweet, addictive fragrance revolving around dark bourbon vanilla. Enriched with tobacco blossom, honey, cacao, and warm woody elements, Vanilla Velvet offers a cozy yet highly premium olfactory experience that wraps you in luxury.",
        details: "Top Notes: Honey, Cacao\nHeart Notes: Tobacco Blossom, Bourbon Vanilla\nBase Notes: Tonka Bean, Sandalwood, Dried Fruits\nLongevity: Extremely Long-lasting (12+ hours)\nSillage: Strong",
        ingredients: "Alcohol Denat., Fragrance (Parfum), Water\\Aqua\\Eau, Coumarin, Benzyl Alcohol, Benzyl Benzoate, Linalool, Eugenol.",
        reviews: [
            { author: "Sophia M.", rating: 5, text: "This is the king of vanilla fragrances. Warm, gourmand, slightly smoky, and absolutely addictive.", date: "July 11, 2026", avatar: "https://i.pravatar.cc/100?img=43" },
            { author: "Marcus D.", rating: 5, text: "A phenomenal fragrance for colder weather. It projects brilliantly and gathers endless compliments.", date: "June 30, 2026", avatar: "https://i.pravatar.cc/100?img=9" }
        ],
        isBestSeller: true,
        isNewArrival: false,
        discount: 0
    },
    {
        id: 8,
        name: "Citrus Fusion",
        brand: "Dior",
        price: 125,
        rating: 4.7,
        reviewCount: 43,
        collection: "Men Collection",
        gender: "men",
        image: "images/perfume_men.png",
        description: "An invigorating blast of fresh citrus, featuring Sicilian lemon, calabrian bergamot, and bitter orange, layered over a sophisticated base of spicy vetiver, white pepper, and aromatic wood notes.",
        details: "Top Notes: Calabrian Bergamot, Sicilian Lemon, Bitter Orange\nHeart Notes: White Pepper, Pink Pepper, Vetiver\nBase Notes: Amberwood, Oakmoss, Patchouli\nLongevity: Moderate to Long (7-9 hours)\nSillage: Moderate",
        ingredients: "Alcohol, Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citronellol, Citral, Coumarin, Geraniol.",
        reviews: [
            { author: "Nathan W.", rating: 5, text: "Perfect summer perfume! Extremely clean, zesty, and classy. Dior did an incredible job.", date: "July 14, 2026", avatar: "https://i.pravatar.cc/100?img=3" },
            { author: "Olivia S.", rating: 4, text: "Bought this for my boyfriend. It smells amazing, fresh and masculine. Longevity is decent too.", date: "July 5, 2026", avatar: "https://i.pravatar.cc/100?img=5" }
        ],
        isBestSeller: false,
        isNewArrival: true,
        discount: 20
    }
];
