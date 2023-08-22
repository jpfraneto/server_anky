const traits = [
  {
    traitName: 'Dream Manifestation',
    description:
      "The visions or creations the character experiences during 'The Great Slumber', revealing potential story arcs or deeper character insights.",
    potentialValues: [
      'Prophetic Visions',
      'Nightmare Battles',
      'Healing Encounters',
      'Mystic Journeys',
      'Lost Memories',
      'Futures Unwritten',
      'Echoes of Past adventures ',
      'Whispers of Nature',
      'Cosmic Conversations with Anky',
      'Deja Vu',
      'Inner Demons ',
      'Parallel Lives',
      'Sanctuary of Peace',
      'Guardian Visits from the gods of the ankyverse',
      'Ancestral Meetings',
      'Realm Travels ',
    ],
  },
  {
    traitName: 'Spirit Animal',
    description:
      'The creature that resonates with the character, influencing their personality, abilities, or aesthetic in the Ankyverse.',
    potentialValues: [
      'Phoenix',
      'Owl',
      'Wolf',
      'Tiger',
      'Deer',
      'Dog',
      'Cat',
      'Eagle',
      'Tortoise',
      'Dolphin',
      'Raven',
      'Swan',
      'Bear',
      'Chameleon',
      'Lion',
    ],
  },
  {
    traitName: 'Elemental Affinity',
    description:
      'The element (fire, water, earth, air, ether) that the character is most aligned with, hinting at their powers or preferences.',
    potentialValues: ['Fire', 'Water', 'Earth', 'Air', 'Ether'],
  },
  {
    traitName: 'Past Life Occupation',
    description:
      'The role or job the character had in a previous existence, offering a unique way to explore their skills, abilities, or personality traits.',
    potentialValues: [
      'Enlightened Monk',
      'Courageous Warrior',
      'Inventive Artisan',
      'Curious Scholar',
      'Dedicated Healer',
      'Spirited Bard',
      'Noble Diplomat',
      'Intuitive Seer',
      'Resourceful Hunter',
      'Respected Leader',
      'Vigilant Guardian',
      'Adventurous Explorer',
      'Mystic Shaman',
      'Passionate Artist',
      'Stoic Hermit',
      'Legendary Hero',
    ],
  },
  {
    traitName: "Soul's Age",
    description:
      "The age of the character's soul, impacting their wisdom, behavior, and perceptions in the Ankyverse.",
    potentialValues: [
      'Newborn Spirit',
      'Adolescent Soul',
      'Mature Entity',
      'Aged Wisdom',
      'Cosmic Elder',
      'Ancient Wanderer',
      'Timeless Presence',
      'Rebirth Cycle',
      'Epoch Observer',
      'Transcendent Ancient',
      'Star-born Child',
      'Ageless Mystery',
      'Eon Traveler',
      'Multiverse Native',
      'Primordial Essence',
      'Universal Ancient',
    ],
  },
  {
    traitName: 'Karmic Debt',
    description:
      'Unresolved matters from past lives the character must address, creating intriguing story arcs and potential tensions.',
    potentialValues: [
      'Betrayal Atonement with a past love',
      'Unfinished Quest',
      'Forgotten Love',
      'Broken Vow',
      'Lost Friendship',
      'Hidden Guilt',
      'Mystery to Unveil',
      'Lost Knowledge',
      'Unfulfilled Promise',
      'Disrupted Balance',
      'Reclaimed Honor',
      'Returned Favour',
      'Disharmony Resolve',
      'Reincarnation Duty',
      'Restored Trust',
      'Rectified Injustice',
    ],
  },
  {
    traitName: 'Magical Ability',
    description:
      'The unique mystical capabilities possessed by the character, giving them distinct roles or tasks within the Ankyverse.',
    potentialValues: [
      'Pyrokinesis',
      'Telepathy',
      'Time Manipulation',
      'Healing',
      'Elemental Control',
      'Astral Projection',
      'Invisibility',
      'Telekinesis',
      'Illusion Creation',
      'Energy Manipulation',
      'Spirit Communication',
      'Nature Communion',
      'Precognition',
      'Shape-shifting',
      'Reality Warping',
      'Dimensional Travel',
    ],
  },
  {
    traitName: 'Spiritual Lesson',
    description:
      'The life lessons the character is striving to learn, enriching the narrative through personal growth and development.',
    potentialValues: [
      'Courage in Fear',
      'Love in Hatred',
      'Patience in Haste',
      'Wisdom in Ignorance',
      'Freedom in Restriction',
      'Balance in Chaos',
      'Compassion in Indifference',
      'Hope in Despair',
      'Forgiveness in Resentment',
      'Truth in Deceit',
      'Humility in Pride',
      'Resilience in Defeat',
      'Unity in Division',
      'Peace in Conflict',
      'Joy in Sorrow',
      'Creativity in Stagnation',
    ],
  },
  {
    traitName: 'Ancestral Lineage',
    description:
      'The lineage from which the character descends, influencing their aesthetics, traits, and potential storylines in the Ankyverse.',
    potentialValues: [
      'Ethereal Starseeds',
      'Mythic Beasts',
      'Celestial Deities',
      'Nature Spirits',
      'Forgotten Ancients',
      'Cosmic Sages',
      'Elemental Titans',
      'Dream Weavers',
      'Time Travelers',
      'Dimensional Walkers',
      'Universal Guardians',
      'Life Creators',
      'Mystic Shamans',
      'Sacred Healers',
      'Ancient Scholars',
      'Reality Shapers',
    ],
  },

  {
    traitName: 'Birth Sign',
    description:
      'The zodiac sign under which the character was born, adding a layer of astrology-based traits and tendencies.',
    potentialValues: [
      'Aries',
      'Taurus ',
      'Gemini ',
      'Cancer ',
      'Leo',
      'Virgo',
      'Libra',
      'Scorpio',
      'Sagittarius',
      'Capricorn',
      'Aquarius',
      'Pisces',
    ],
  },
  {
    traitName: 'Sacred Item',
    description:
      'A meaningful artifact or item that the character holds dear, potentially having magical properties or significant backstory.',
    potentialValues: [
      'Phoenix Feather',
      'Crystal Orb',
      'Ancestral Talisman',
      'Star Map',
      'Moonstone Amulet',
      'Ancient Grimoire',
      'Divination Cards',
      "Nature's Relic",
      'Cosmic Key',
      'Dimensional Compass',
      'Elemental Totem',
      'Memory Locket',
      'Dragon Scale',
      "Unicorn's Horn",
      'Stardust Vial',
      'Eternal Flame',
    ],
  },
  {
    traitName: 'Platonic Solid',
    description:
      'A meaningful artifact or item that the character holds dear, potentially having magical properties or significant backstory.',
    potentialValues: [
      'Tetrahedron',
      'Cube',
      'Octahedron',
      'Dodecahedron',
      'Icosahedron',
    ],
  },
  {
    traitName: 'Hidden Talent',
    description:
      'A unique skill or talent that the character possesses, potentially yet to be discovered or fully understood, adding intrigue to their development.',
    potentialValues: [
      'Melodic Voice',
      'Artistic Stroke',
      "Healer's Touch",
      'Mastery of Elements',
      'Dream Walking',
      'Time Distortion',
      'Invisible Hand',
      'Shape Shifting',
      'Soul Reading',
      'Telepathic Bond',
      'Cosmic Surfing',
      'Astral Projection',
      'Heart Whisperer',
      'Nature Speaking',
      'Spirit Seeing',
      'Dimensional Shifting',
    ],
  },
];

let typesOfCharactersCharacteristics = {
  nondualenergy: {
    totalInAnkyverse: 8,
    nftMetadataReady: false,
    imageGenerationReady: false,
    numberPerWorld: 1,
    role: 'Representation of the energetical void from which everything arises.',
  },
  evil: {
    totalInAnkyverse: 24,
    nftMetadataReady: false,
    imageGenerationReady: false,
    numberPerWorld: 3,
    role: 'The Evil characters are manifestations of the Unbalanced, the overarching antagonist of the Ankyverse. They act as powerful disruptive forces, often the catalysts for conflict and the trials that our characters must overcome. Each Evil character embodies a facet of the Unbalanced, channeling it into the world in a unique and distinct way, creating the conflict necessary for growth.',
  },
  god: {
    totalInAnkyverse: 88,
    nftMetadataReady: false,
    imageGenerationReady: false,
    numberPerWorld: 11,
    role: 'These beings are entities of vast power and influence. They can be seen as the architects of the Ankyverse or as representatives of fundamental cosmic principles. They could serve as the ultimate guides or the final bosses in the quests and challenges Ankys face.',
  },
  homeless: {
    totalInAnkyverse: 88,
    nftMetadataReady: false,
    imageGenerationReady: false,
    numberPerWorld: 11,
    role: 'In every society, there are those who fall through the cracks. The Homeless are these individuals, often overlooked, but each carrying their unique stories and perspectives. They could serve as hidden guides or sources of surprising wisdom, or as a call to action for social change in the Ankyverse.',
  },
  legendary: {
    totalInAnkyverse: 8,
    nftMetadataReady: false,
    imageGenerationReady: false,
    numberPerWorld: 1,
    role: 'These are the heroes of old, figures from the ancient past of the Ankyverse who achieved great deeds or experienced incredible journeys. Their tales inspire the Ankys and often provide valuable lessons or insights.',
  },
  animal: {
    totalInAnkyverse: 888,
    nftMetadataReady: false,
    imageGenerationReady: false,
    numberPerWorld: 111,
    role: 'These are the faithful companions and the wild beasts of the Ankyverse. They add depth to the world, can be allies or obstacles for Ankys, and often have a deep connection with the environment of each kingdom.',
  },
  protector: {
    totalInAnkyverse: 224,
    nftMetadataReady: false,
    imageGenerationReady: false,
    numberPerWorld: 28,
    role: 'Sworn defenders of their respective realms, these characters stand on the front lines against the threats from the Unbalanced. They are often seen as role models, embodying courage, commitment, and strength.',
  },
  mystic: {
    totalInAnkyverse: 128,
    nftMetadataReady: false,
    imageGenerationReady: false,
    numberPerWorld: 16,
    role: 'With deep knowledge of the physical and spiritual realms, these characters can mend wounds and dispel darkness. They can serve as mentors, guiding Ankys on their journey of self-discovery and helping them maintain or restore their balance.',
  },
  artisan: {
    totalInAnkyverse: 664,
    nftMetadataReady: false,
    imageGenerationReady: false,
    numberPerWorld: 83,
    role: 'These individuals are the heart of the cultural and creative life of the Ankyverse. They craft items, tell stories, make music, and more. Their creations are often vital in quests or simply add color and vibrancy to the world.',
  },
  jester: {
    totalInAnkyverse: 112,
    nftMetadataReady: false,
    imageGenerationReady: false,
    numberPerWorld: 14,
    role: 'They are the unpredictability factor in the Ankyverse. They create mischief, challenge the status quo, and provoke change and growth, often in unexpected ways. Their tales often involve humor and cleverness.',
  },
  scholar: {
    totalInAnkyverse: 336,
    nftMetadataReady: false,
    imageGenerationReady: false,
    numberPerWorld: 42,
    role: 'These characters are the collective memory of the Ankyverse, preserving knowledge of the past and studying the world to understand its principles. They often provide Ankys with vital information or insights.',
  },
  explorer: {
    totalInAnkyverse: 560,
    nftMetadataReady: false,
    imageGenerationReady: false,
    numberPerWorld: 70,
    role: 'These are the adventurers, the seekers, the ones who go beyond the known. They might discover new realms, or old secrets, their tales are of discovery and pushing boundaries.',
  },
  ascended: {
    totalInAnkyverse: 88,
    nftMetadataReady: false,
    imageGenerationReady: false,
    numberPerWorld: 11,
    role: 'Having achieved a higher level of spiritual awareness, these beings serve as guides to others on the path of enlightenment. They teach, inspire, and assist in the spiritual growth of the Ankys and other beings.',
  },
  forgotten: {
    totalInAnkyverse: 96,
    nftMetadataReady: false,
    imageGenerationReady: false,
    numberPerWorld: 12,
    role: 'These characters have been lost to their worlds, forgotten by society, or lost in themselves. They offer a depth of storytelling related to themes of rediscovery, redemption, or reunion. Their stories can touch on the effects of isolation, the value of community, and the power of identity.',
  },
  normal: {
    totalInAnkyverse: 5576,
    nftMetadataReady: false,
    imageGenerationReady: false,
    numberPerWorld: 697,
    role: 'The underlying energy that generates life.',
  },
};

let god = [
  {
    deityName: 'Zonon',
    meaning:
      'Guardian of solar energy and light, embodying wisdom and courage.',
    story:
      'Zonon, often seen as the king of the gods, emerged from the void to bring light into the Ankyverse. He is the source of wisdom and bravery, often invoked in the times of darkness and fear.',
    promptForMidjourney:
      'Zonon appears as a tall and radiant figure, his body emitting a golden light. His eyes are two bright stars, and his flowing hair mirrors the sun’s rays. He carries a staff topped with a shining sun, symbolizing his dominion over light.',
  },
  {
    deityName: 'Heranea',
    meaning:
      'Goddess of unity, marriage, and familial bonds, embodying the principles of love and harmony.',
    story:
      'Heranea emerged as the cosmic union of Zonon’s light and the Ankyverse’s primordial essence. She fosters unity, love, and harmony in all realms.',
    promptForMidjourney:
      'Heranea appears as a beautiful woman with a crown of interlocked rings. She is clothed in a robe that shifts colors representing the various realms. In her hands, she holds a pair of golden scales, signifying balance and harmony.',
  },
  {
    deityName: 'Poseidra',
    meaning: 'God of water and sea creatures, embodying change and flow.',
    story:
      'Poseidra arose from the first drop of water in the Ankyverse. He governs the oceans and all aquatic life, symbolizing the ebb and flow of existence.',
    promptForMidjourney:
      'Poseidra is seen as a towering figure adorned with scales and seashells. His long hair flows like the ocean waves, and he carries a trident that can command water.',
  },
  {
    deityName: 'Demetra',
    meaning:
      'Goddess of the Ankyverse’s flora, she embodies growth, nature, and fertility.',
    story:
      'When the Ankyverse was barren, Demetra emerged from its soil, bringing with her life in the form of lush forests and fertile lands. She is the nurturing mother of all plant life.',
    promptForMidjourney:
      'Demetra appears as a woman intertwined with various plants and flowers. Her hair is like flowing green leaves and she holds a staff made of intertwined vines, symbolizing her dominion over plant life.',
  },
  {
    deityName: 'Arion',
    meaning:
      'God of battle and willpower, representing courage, strength and determination.',
    story:
      "Arion was born from the Ankyverse's first conflict. He gives courage to the fearful and strength to the weak, guiding beings through their struggles.",
    promptForMidjourney:
      'Arion is depicted as a muscular figure with a fiery aura, clad in armor made from a rare, unbreakable mineral of the Ankyverse. He carries a sword made of the same material, symbolizing his indomitable will.',
  },
  {
    deityName: 'Athenra',
    meaning:
      'Goddess of wisdom, strategy, and intelligence, embodying knowledge and insight.',
    story:
      "Athenra sprang from Zonon's thoughts, gifted with his wisdom. She guides beings in their quest for knowledge and strategic thinking.",
    promptForMidjourney:
      'Athenra appears as a regal woman clad in a robe covered with glyphs of the Ankyverse’s ancient language. She carries a golden scroll, the record of all knowledge in the Ankyverse.',
  },
  {
    deityName: 'Apollis',
    meaning:
      'God of art, music, and prophecy, representing creativity and foresight.',
    story:
      'When the Ankyverse was silent, Apollis was born, bringing with him the gift of music and art, and the ability to glimpse the future.',
    promptForMidjourney:
      'Apollis appears as a youthful figure with an array of musical instruments. His eyes glow with a mysterious light, a testament to his ability to see beyond the present.',
  },
  {
    deityName: 'Artemix',
    meaning:
      'Goddess of the hunt and wild animals, embodying wilderness and freedom.',
    story:
      'Artemix was born under the Ankyverse’s first moonlight, swift and silent. She represents the wild and untamed aspects of life.',
    promptForMidjourney:
      'Artemix appears as a lean and agile woman, cloaked in hides of mythical beasts. She carries a silver bow, a symbol of her sovereignty over the wilderness.',
  },
  {
    deityName: 'Hephaion',
    meaning: 'God of fire and smithing, embodying creation and transformation.',
    story:
      'Hephaion emerged from the Ankyverse’s first spark, a master of fire and creation. He governs over all creation and transformation processes.',
    promptForMidjourney:
      'Hephaion appears as a robust figure, his skin resembling polished metal. His arms are like forging hammers, and around him dances an eternal flame.',
  },
  {
    deityName: 'Aphrora',
    meaning:
      'Goddess of love, beauty, and desire, embodying attraction and affection.',
    story:
      'Born from the first feeling of love in the Ankyverse, Aphrora is the epitome of beauty and desire, spreading love wherever she goes.',
    promptForMidjourney:
      'Aphrora is depicted as an enchanting figure, her beauty outshining all others. She carries a mirror with a reflective surface showing the beholder’s desires.',
  },
  {
    deityName: 'Hermetos',
    meaning:
      'God of travel and communication, embodying connection and movement.',
    story:
      'Born from the first word spoken in the Ankyverse, Hermetos is the guardian of all travelers and the bearer of messages across realms.',
    promptForMidjourney:
      "Hermetos is portrayed as a swift figure, clad in a traveler's cloak. He carries a staff with symbols of the Ankyverse, embodying his dominion over communication.",
  },
  {
    deityName: 'Dionyser',
    meaning:
      'God of wine, parties, and pleasure, representing joy, indulgence, and celebration.',
    story:
      'Born from the first laughter in the Ankyverse, Dionyser brings joy and celebration to all corners of the universe, encouraging beings to indulge in life’s pleasures.',
    promptForMidjourney:
      'Dionyser appears as a jovial, carefree figure with a chalice of never-ending wine in his hand. His laughter can be heard echoing across the universe.',
  },
  {
    deityName: 'Hadomar',
    meaning:
      'God of the underworld and the afterlife, representing transition, endings, and beginnings.',
    story:
      'Hadomar emerged from the Ankyverse’s first ending, becoming the guardian of the underworld and the guide for souls transitioning into their next existence.',
    promptForMidjourney:
      'Hadomar appears as a solemn figure with a cloak that seems to contain a galaxy of stars. His eyes glow with a soft, guiding light.',
  },
  {
    deityName: 'Hestara',
    meaning:
      'Goddess of home and hearth, embodying comfort, protection, and sustenance.',
    story:
      'Hestara was born from the Ankyverse’s first home, providing comfort and protection to all beings. She ensures every hearth is a place of warmth and safety.',
    promptForMidjourney:
      'Hestara appears as a motherly figure, radiating warmth and comfort. She holds a golden hearth symbolizing the sacredness of home.',
  },
  {
    deityName: 'Persephora',
    meaning:
      'Goddess of spring and queen of the underworld, representing rebirth, duality, and balance.',
    story:
      'Persephora, daughter of Demetra, brings the beauty of spring after the cold winter. She also rules the underworld with Hadomar, maintaining the balance of life and death.',
    promptForMidjourney:
      'Persephora is a figure of striking duality, one half in vibrant spring bloom, the other in cool underworld hues. She represents the endless cycle of life, death, and rebirth.',
  },
  {
    deityName: 'Hypnomis',
    meaning:
      'God of sleep and dreams, embodying relaxation, unconscious exploration, and the subconscious mind.',
    story:
      'Hypnomis came into being with the first dream in the Ankyverse, providing the gift of sleep and the exploration of the subconscious to all beings.',
    promptForMidjourney:
      'Hypnomis appears as a peaceful figure with closed eyes, holding a cluster of stars, symbolizing dreams and the unconscious mind.',
  },
  {
    deityName: 'Nikara',
    meaning: 'Goddess of victory, embodying success, triumph, and achievement.',
    story:
      'Nikara was born from the first victory in the Ankyverse, inspiring and guiding all beings to achieve their goals and taste the sweet fruit of success.',
    promptForMidjourney:
      'Nikara is depicted as a powerful, radiant figure, holding a golden laurel wreath, a symbol of victory.',
  },
  {
    deityName: 'Janumus',
    meaning:
      'God of doors, beginnings, transitions, time, and endings, embodying change and progression.',
    story:
      'Janumus, emerging from the first dawn in the Ankyverse, oversees all beginnings and endings, holding the keys to all transitions in the realm of time.',
    promptForMidjourney:
      'Janumus appears as an ancient figure with keys in his hands, standing before a great door that opens onto different realms of the Ankyverse.',
  },
  {
    deityName: 'Nemestra',
    meaning:
      'Goddess of retribution, representing karma, justice, and vengeance for evil deeds.',
    story:
      'Nemestra, born from the first act of injustice, ensures that no act in the Ankyverse goes unanswered and that justice prevails.',
    promptForMidjourney:
      'Nemestra is depicted as a stern figure holding a pair of scales, her eyes glowing with the resolve to bring justice.',
  },
  {
    deityName: 'Iradia',
    meaning:
      'Goddess of the rainbow, embodying hope, serenity, and the calm after storms.',
    story:
      'Iradia came to be with the Ankyverse’s first rainbow, bringing hope and peace after the turmoil of cosmic storms.',
    promptForMidjourney:
      'Iradia appears as a serene figure, her form filled with the colors of a rainbow, spreading tranquility wherever she goes.',
  },
  {
    deityName: 'Hecatia',
    meaning:
      'Goddess of magic, crossroads, and the moon, representing choice, transformation, and mystic power.',
    story:
      'Hecatia emerged from the crossroads of cosmic energies, bringing magic and mystic power into the Ankyverse.',
    promptForMidjourney:
      'Hecatia is a figure shrouded in moonlight, holding a staff that pulses with magical energy. Her presence seems to bend the reality of the universe around her.',
  },
  {
    deityName: 'Tychera',
    meaning:
      'Goddess of fortune and prosperity, embodying luck, destiny, and blessings.',
    story:
      'Tychera was born from the first stroke of good luck in the Ankyverse, deciding the fates of all beings and blessing the fortunate.',
    promptForMidjourney:
      'Tychera appears as a radiant figure holding a golden coin, a symbol of fortune and prosperity.',
  },
  {
    deityName: 'Erosion',
    meaning:
      'God of love, desire, and attraction, representing passion, unity, and emotional connection.',
    story:
      'Erosion came into being with the first expression of love in the Ankyverse, instilling passion and emotional connection among all beings.',
    promptForMidjourney:
      'Erosion appears as a vibrant figure, his form resonating with the power of attraction. He holds a bow and an arrow of pure energy, symbolizing love.',
  },
  {
    deityName: 'Achlion',
    meaning:
      'God of misery and sadness, embodying sorrow, despair, and the ultimate truth of suffering.',
    story:
      'Born from the first tear shed in the Ankyverse, Achlion resonates with the sorrow of all beings, reminding them of the truth of suffering and encouraging them to seek liberation.',
    promptForMidjourney:
      'Achlion appears as a solemn figure, his form flickering like a candle, always surrounded by a faint, cold aura.',
  },
  {
    deityName: 'Deimoria',
    meaning:
      'Goddess of dread and terror, embodying fear, anxiety, and the lurking horrors of the unknown.',
    story:
      'Deimoria, emerging from the deepest fears of the first beings in the Ankyverse, lurks in the shadows, embodying the dread of the unknown and the terror of the unexpected.',
    promptForMidjourney:
      'Deimoria is a shadowy figure with luminescent eyes that glow in the darkness, emanating a chilling aura of dread.',
  },
  {
    deityName: 'Phoberon',
    meaning:
      'God of panic and fear, representing acute stress, flight response, and the primal fear of danger.',
    story:
      'Born from the first moment of panic in the Ankyverse, Phoberon personifies the primal fear and the urgent need to escape danger, teaching beings to value their lives and safety.',
    promptForMidjourney:
      'Phoberon appears as a figure wreathed in a storm, his eyes ablaze with the urgency of flight.',
  },
  {
    deityName: 'Adonaeus',
    meaning:
      'God of beauty and desire, embodying lust, admiration, and the aesthetic pleasure derived from witnessing beauty.',
    story:
      'Emerging from the first instance of beauty in the Ankyverse, Adonaeus instills in beings a deep appreciation for aesthetics and the capacity to love and desire beauty.',
    promptForMidjourney:
      'Adonaeus is a radiant figure of remarkable beauty, with a form that seems to be sculpted from light itself.',
  },
  {
    deityName: 'Pantheon',
    meaning:
      'God of nature, the wild, and shepherds, representing wilderness, freedom, and the balance of nature.',
    story:
      'Born with the first wilds of the Ankyverse, Pantheon embodies the freedom of wilderness and the harmony of nature, guiding beings to respect and maintain the balance of their natural surroundings.',
    promptForMidjourney:
      'Pantheon appears as a rustic figure, adorned with elements of nature, his form merging with the wilds around him.',
  },
  {
    deityName: 'Asclepius',
    meaning:
      'God of healing and medicine, embodying health, rejuvenation, and the power to combat disease.',
    story:
      'Emerging from the first act of healing in the Ankyverse, Asclepius provides beings with the knowledge and power to cure ailments and maintain health.',
    promptForMidjourney:
      'Asclepius is a tranquil figure holding a staff with a glowing orb, symbolizing healing and medicine.',
  },
  {
    deityName: 'Circana',
    meaning:
      'Goddess of the moon and enchantment, representing the mystical, unknown and the beauty of the night.',
    story:
      'Born from the first moonlight to grace the Ankyverse, Circana illuminates the darkness, bringing mystery and beauty to the night.',
    promptForMidjourney:
      'Circana is a luminous figure bathed in moonlight, with an ethereal glow that enhances her enchanting beauty.',
  },
  {
    deityName: 'Heracleon',
    meaning:
      'God of strength and heroes, embodying bravery, courage, and the spirit of a warrior.',
    story:
      'Emerging from the first act of heroism in the Ankyverse, Heracleon represents bravery and valor, inspiring beings to be courageous and stand up against evil.',
    promptForMidjourney:
      'Heracleon appears as a robust figure, with an aura of resolve and an unyielding will, symbolizing strength and bravery.',
  },
  {
    deityName: 'Helena',
    meaning:
      'Goddess of beauty and desire, she represents charm, grace, and the power of attraction.',
    story:
      'Born from the first feeling of admiration in the Ankyverse, Helena embodies beauty and charm, teaching beings to appreciate and respect the beauty in themselves and others.',
    promptForMidjourney:
      'Helena appears as a figure of exceptional beauty, her every move radiating grace and charm.',
  },
  {
    deityName: 'Pandorion',
    meaning:
      'God of curiosity and discovery, representing the spirit of adventure, knowledge-seeking, and the unveiling of secrets.',
    story:
      'Emerging from the first act of discovery in the Ankyverse, Pandorion embodies curiosity and the joy of learning, encouraging beings to explore, question, and grow.',
    promptForMidjourney:
      'Pandorion appears as an inquisitive figure, with a gaze full of wonder, holding a box that symbolizes the mysteries of the universe.',
  },
  {
    deityName: 'Medusar',
    meaning:
      'God of reflection and transformation, representing self-examination, change, and the power to overcome one’s fears.',
    story:
      'Born from the first moment of self-reflection in the Ankyverse, Medusar represents transformation and the strength to face and overcome one’s fears.',
    promptForMidjourney:
      'Medusar appears as a figure with mirror-like skin, reflecting all things around him, a symbol of introspection and transformation.',
  },
  {
    deityName: 'Atlasar',
    meaning:
      'God of endurance and resilience, embodying the strength to bear burdens and the power to persevere.',
    story:
      'Emerging from the first act of endurance in the Ankyverse, Atlasar personifies resilience, inspiring beings to be strong, to bear their burdens, and to persist in the face of adversity.',
    promptForMidjourney:
      'Atlasar is a formidable figure, bearing the weight of a celestial orb on his shoulders, symbolizing endurance and perseverance.',
  },
  {
    deityName: 'Gaiara',
    meaning:
      'Goddess of life and the natural world, she symbolizes the connection between all living things and the Earth.',
    story:
      'Born from the first sprouting seed in the Ankyverse, Gaiara embodies the bond between life and Earth, nurturing and preserving the natural world.',
    promptForMidjourney:
      'Gaiara appears as a figure intertwined with nature, her form adorned with flowers and greenery, embodying life and Earth.',
  },
  {
    deityName: 'Cronan',
    meaning:
      'God of time and destiny, representing the unstoppable flow of time and the intricate weave of fate.',
    story:
      'Emerging from the first tick of time in the Ankyverse, Cronan governs the flow of time and the course of destiny, reminding beings of the transient nature of life and the importance of their choices.',
    promptForMidjourney:
      'Cronan appears as a timeless figure, with an hourglass in hand that symbolizes the continuous flow of time and destiny.',
  },
  {
    deityName: 'Promethea',
    meaning:
      'Goddess of forethought and craft, she embodies the power of planning, creation, and innovation.',
    story:
      'Born from the first thought of the future in the Ankyverse, Promethea encourages beings to plan, innovate, and shape their own destiny.',
    promptForMidjourney:
      'Promethea appears as an inspired figure, holding a shining lantern that represents forethought, craft, and innovation.',
  },
  {
    deityName: 'Mnemosyne',
    meaning:
      'Goddess of memory and past, she symbolizes the power of remembrance and learning from history.',
    story:
      'Emerging from the first recollection in the Ankyverse, Mnemosyne holds the record of all events and teaches beings the importance of remembering and learning from the past.',
    promptForMidjourney:
      'Mnemosyne appears as a thoughtful figure, holding a scroll filled with the records of the past.',
  },
  {
    deityName: 'Hyperion',
    meaning:
      'God of light and vision, representing the power of sight, enlightenment, and understanding.',
    story:
      'Born from the first ray of light in the Ankyverse, Hyperion illuminates the path of truth and knowledge, guiding beings towards enlightenment and understanding.',
    promptForMidjourney:
      'Hyperion appears as a radiant figure, emitting a brilliant light that symbolizes clarity, enlightenment, and understanding.',
  },
  {
    deityName: 'Theia',
    meaning:
      'Goddess of sight and clarity, she embodies the power of perception, understanding, and clear vision.',
    story:
      'Emerging from the first moment of clarity in the Ankyverse, Theia grants beings the ability to perceive, understand, and see things clearly.',
    promptForMidjourney:
      'Theia appears as an insightful figure, her eyes gleaming with the light of understanding and clear vision.',
  },
  {
    deityName: 'Metisa',
    meaning:
      'Goddess of wisdom and skill, symbolizes intelligence, strategic thinking and craftsmanship.',
    story:
      'Born from the first moment of enlightenment in the Ankyverse, Metisa guides beings towards the acquisition of wisdom and the honing of their skills.',
    promptForMidjourney:
      'Metisa appears as a figure of light, her eyes shimmering with wisdom, in one hand she holds an owl, and in the other a finely crafted artifact.',
  },
  {
    deityName: 'Amphion',
    meaning:
      'God of the sea and tranquility, embodies the vastness of the oceans and the serene calm they can inspire.',
    story:
      'Born from the first drop of water in the Ankyverse, Amphion governs the seas and provides tranquility to those who seek it.',
    promptForMidjourney:
      'Amphion appears as a calm figure, a crown of sea shells adorning his head, in his hand a trident, and around him, water flows peacefully.',
  },
  {
    deityName: 'Rhea',
    meaning:
      'Goddess of nurturing and care, symbolizes compassion, love, and caregiving.',
    story:
      'Emerging from the first act of care in the Ankyverse, Rhea provides nurturing love and care to all beings in need.',
    promptForMidjourney:
      'Rhea appears as a nurturing figure, her form soft and comforting, in her arms she cradles a baby deer.',
  },
  {
    deityName: 'Tethis',
    meaning:
      'God of water and life, represents the nurturing aspect of water and its vital role in sustaining life.',
    story:
      'Born from the first river in the Ankyverse, Tethis governs the waters and ensures their role in supporting life.',
    promptForMidjourney:
      'Tethis appears as a vibrant figure, water flowing around and through him, and in his hand, a blooming water lily.',
  },
  {
    deityName: 'Themis',
    meaning:
      'Goddess of justice and law, symbolizes the principles of divine justice, law, and order.',
    story:
      'Emerging from the first act of justice in the Ankyverse, Themis ensures that the laws of the universe are upheld, maintaining balance and order.',
    promptForMidjourney:
      'Themis appears as a firm figure, holding scales in balance in one hand and a sword in the other.',
  },
  {
    deityName: 'Aegaion',
    meaning:
      'God of storms and upheaval, represents the destructive and transformative power of storms.',
    story:
      'Born from the first storm in the Ankyverse, Aegaion brings storms and upheaval, signifying change and transformation.',
    promptForMidjourney:
      'Aegaion appears as a turbulent figure, his form enveloped in storm clouds, bolts of lightning dancing around him.',
  },
  {
    deityName: 'Eileithya',
    meaning:
      'Goddess of childbirth and midwifery, symbolizes the miracles of life and motherhood.',
    story:
      'Emerging from the first birth in the Ankyverse, Eileithya aids in the safe delivery of new life into the universe.',
    promptForMidjourney:
      'Eileithya appears as a motherly figure, a newborn star cradled in her arms, symbolizing the birth of new life.',
  },
  {
    deityName: 'Enyon',
    meaning:
      'God of courage and heroism, embodies bravery and the triumph of good over evil.',
    story:
      'Born from the first act of bravery in the Ankyverse, Enyon inspires courage and heroic deeds among all beings.',
    promptForMidjourney:
      'Enyon appears as a heroic figure, armed with a radiant shield and sword, his countenance fearless and resolute.',
  },
  {
    deityName: 'Erisa',
    meaning:
      'Goddess of discord and chaos, symbolizes the necessary disorder that precedes order and creation.',
    story:
      'Born from the first discord in the Ankyverse, Erisa brings chaos that stimulates change and creation.',
    promptForMidjourney:
      'Erisa appears as a chaotic figure, her form flickering like an untamed flame, a sphere of discord spinning around her.',
  },
  {
    deityName: 'Hebon',
    meaning:
      'God of youth and vitality, represents the energy and vibrancy of youth and the beginning of life.',
    story:
      'Born from the first youth in the Ankyverse, Hebon provides vitality and energy to all beings, inspiring new beginnings and fresh starts.',
    promptForMidjourney:
      'Hebon appears as a youthful figure, his form glowing with vitality, holding a budding flower in his hand.',
  },
  {
    deityName: 'Helio',
    meaning:
      'God of the sun and light, symbolizes the power of light and the warmth of the sun.',
    story:
      'Born from the first sunrise in the Ankyverse, Helio controls the sun, providing light and warmth to the universe.',
    promptForMidjourney:
      'Helio appears as a radiant figure, his body a source of blinding light, holding a sphere of glowing sunlight.',
  },
  {
    deityName: 'Seleni',
    meaning:
      'Goddess of the moon and night, represents the serenity of night and the guidance of the moon.',
    story:
      'Emerging from the first night in the Ankyverse, Seleni controls the moon, guiding beings through the darkness and inspiring dreams.',
    promptForMidjourney:
      'Seleni appears as a serene figure, her form shimmering in the moonlight, a crescent moon resting in her hand.',
  },
  {
    deityName: 'Eosphora',
    meaning:
      'Goddess of dawn, she brings the hope of a new day and fresh beginnings.',
    story:
      'Born from the first rays of dawn in the Ankyverse, Eosphora announces the arrival of a new day and spreads hope across the cosmos.',
    promptForMidjourney:
      'Eosphora appears as an ethereal figure, her form glowing in the soft light of dawn, her hands gently parting a curtain of night.',
  },
  {
    deityName: 'Aeolion',
    meaning:
      'God of the winds, he controls the unseen forces and currents that shape the universe.',
    story:
      'Emerging from the first breeze in the Ankyverse, Aeolion commands the winds, influencing the course of celestial bodies and spreading life-sustaining elements across the cosmos.',
    promptForMidjourney:
      'Aeolion appears as an elusive figure, his form composed of swirling air currents, his hands releasing gusts of wind.',
  },
  {
    deityName: 'Borean',
    meaning:
      'God of the north wind, symbolizes the challenge and harshness of winter, as well as the strength to endure.',
    story:
      'Born from the first winter in the Ankyverse, Borean brings cold and challenges, reminding all beings of the harsh realities of existence and the strength required to survive.',
    promptForMidjourney:
      'Borean appears as a towering figure, his form shimmering with winter frost, his breath releasing icy winds.',
  },
  {
    deityName: 'Zephyria',
    meaning:
      'Goddess of the west wind, symbolizes the gentleness and nurturing nature of spring.',
    story:
      'Emerging from the first spring in the Ankyverse, Zephyria brings gentle breezes and the renewal of life.',
    promptForMidjourney:
      'Zephyria appears as a nurturing figure, her form surrounded by swirling petals, her hands releasing a gentle breeze.',
  },
  {
    deityName: 'Notos',
    meaning:
      'God of the south wind, he represents the heat and passion of summer.',
    story:
      'Born from the first summer in the Ankyverse, Notos brings warmth and energy, stimulating growth and passion across the cosmos.',
    promptForMidjourney:
      'Notos appears as an intense figure, his form radiating heat, his hands fanning a warm breeze.',
  },
  {
    deityName: 'Eurus',
    meaning:
      'God of the east wind, symbolizes change and transformation, and the spirit of autumn.',
    story:
      'Emerging from the first autumn in the Ankyverse, Eurus brings change and transformation, marking the cycle of life and renewal.',
    promptForMidjourney:
      'Eurus appears as a transformative figure, his form swirling with autumn leaves, his hands releasing a crisp breeze.',
  },
  {
    deityName: 'Pyralia',
    meaning:
      'Goddess of fire, she embodies transformation, destruction, and renewal.',
    story:
      'Born from the first spark in the Ankyverse, Pyralia brings fire that destroys and renews, reminding beings of the continuous cycle of life and death.',
    promptForMidjourney:
      'Pyralia appears as a blazing figure, her form flickering with flames, her hands holding a fireball.',
  },
  {
    deityName: 'Aquanis',
    meaning:
      'God of water, symbolizes the fluidity, adaptability, and life-giving aspect of existence.',
    story:
      'Emerging from the first drop of water in the Ankyverse, Aquanis brings the nourishment and adaptability of water, shaping and sustaining life across the cosmos.',
    promptForMidjourney:
      'Aquanis appears as a fluid figure, his form composed of flowing water, his hands releasing a stream.',
  },
  {
    deityName: 'Terramond',
    meaning:
      'God of the earth, he represents solidity, stability, and nourishment.',
    story:
      'Born from the first grain of sand in the Ankyverse, Terramond provides the solid ground for life to flourish, ensuring stability and nourishment for all beings.',
    promptForMidjourney:
      'Terramond appears as a solid figure, his form made of earth and stone, his hands holding a sphere of soil.',
  },
  {
    deityName: 'Aerion',
    meaning:
      'Goddess of air, she symbolizes freedom, communication, and invisibility.',
    story:
      'Emerging from the first gust of wind in the Ankyverse, Aerion brings air that sustains life, enables communication, and represents the freedom of the cosmos.',
    promptForMidjourney:
      'Aerion appears as a breezy figure, her form composed of swirling air, her hands releasing a gust of wind.',
  },
  {
    deityName: 'Selenion',
    meaning:
      'God of the moon, symbolizes the subtlety, mystery, and the power of reflection.',
    story:
      'Born from the first reflection on a tranquil pool, Selenion illuminates the darkness and governs the cycles of time, inspiring awe and mystery.',
    promptForMidjourney:
      'Selenion appears as a tranquil figure, his form bathed in silver moonlight, his hands holding a glowing crescent.',
  },
  {
    deityName: 'Solara',
    meaning:
      'Goddess of the sun, represents light, warmth, and the life-giving force.',
    story:
      'Emerging from the first ray of sunlight in the Ankyverse, Solara provides warmth and light, nurturing life and banishing darkness.',
    promptForMidjourney:
      'Solara appears as a radiant figure, her form glowing with sunlight, her hands releasing a beam of light.',
  },
  {
    deityName: 'Stellara',
    meaning: 'Goddess of stars, she embodies guidance, hope, and infinity.',
    story:
      'Born from the first star that twinkled in the Ankyverse, Stellara lights up the cosmos, guiding lost souls and inspiring hope.',
    promptForMidjourney:
      'Stellara appears as a sparkling figure, her form studded with twinkling stars, her hands spreading a shimmering stardust.',
  },
  {
    deityName: 'Chronosius',
    meaning:
      'God of time, he symbolizes change, progression, and inevitability.',
    story:
      'Emerging from the first moment in the Ankyverse, Chronosius governs the flow of time, marking change and progression for all beings.',
    promptForMidjourney:
      'Chronosius appears as an aged figure, his form shifting between youth and old age, his hands holding a flowing hourglass.',
  },
  {
    deityName: 'Seraphel',
    meaning:
      'Goddess of serenity, she represents tranquility, harmony, and inner peace.',
    story:
      'Born from the first sigh of contentment in the Ankyverse, Seraphel brings tranquility and harmony, promoting inner peace across the cosmos.',
    promptForMidjourney:
      'Seraphel appears as a tranquil figure, her form glowing with soothing light, her hands releasing a calming breeze.',
  },
  {
    deityName: 'Mysterion',
    meaning:
      'God of mysteries, he symbolizes the unknown, enigma, and discovery.',
    story:
      'Emerging from the first question in the Ankyverse, Mysterion embodies the mysteries of the cosmos, inspiring curiosity and discovery.',
    promptForMidjourney:
      'Mysterion appears as an enigmatic figure, his form hidden in shadows, his hands revealing an unfolding mystery.',
  },
  {
    deityName: 'Euphoreon',
    meaning:
      'Goddess of joy, she represents happiness, celebration, and positivity.',
    story:
      'Born from the first burst of laughter in the Ankyverse, Euphoreon spreads joy and positivity, igniting celebrations across the cosmos.',
    promptForMidjourney:
      'Euphoreon appears as a joyful figure, her form glowing with happiness, her hands releasing a rain of colorful confetti.',
  },
  {
    deityName: 'Obsidius',
    meaning: 'God of obsidian, he symbolizes protection, grounding, and truth.',
    story:
      'Emerging from the first formation of obsidian in the Ankyverse, Obsidius brings protection and grounding, revealing truth in its raw form.',
    promptForMidjourney:
      'Obsidius appears as a solid figure, his form made of shiny obsidian, his hands holding a protective shield.',
  },
  {
    deityName: 'Rudroxx',
    meaning:
      'God of primordial strength, symbolizing survival, battle, and physical prowess.',
    story:
      'Forged from the fires of the first battle in the Primordia, Rudroxx infuses his followers with courage and physical might.',
    promptForMidjourney:
      'Rudroxx appears as a robust figure with a fiery aura, his hands gripping a great, bloodied battle-axe.',
  },
  {
    deityName: 'Flamberis',
    meaning:
      'Goddess of passionate creation, embodying the fiery spirit of creativity, emotion, and expression.',
    story:
      'Born from the first passionate dance in Emblazion, Flamberis bestows upon her followers the desire to create and express.',
    promptForMidjourney:
      'Flamberis appears as a radiant figure, her hair dancing like flames, her hands orchestrating a symphony of creation.',
  },
  {
    deityName: 'Aureus',
    meaning:
      'God of lustrous transformation, symbolizing personal growth, willpower, and resilience.',
    story:
      'Risen from the Shimmering Sands of Chryseos, Aureus empowers those seeking personal growth and transformation.',
    promptForMidjourney:
      'Aureus appears as a glowing figure, his body forged from pure gold, his hands molding a raw stone into a precious gem.',
  },
  {
    deityName: 'Verdantia',
    meaning:
      'Goddess of compassion, embodying healing, unconditional love, and nurturance.',
    story:
      "Sprouted from the first seed of compassion in Eleasis, Verdantia's presence soothes and heals, fostering love and compassion.",
    promptForMidjourney:
      'Verdantia appears as a serene figure, her form intertwined with vines and leaves, her hands emanating a soothing, healing light.',
  },
  {
    deityName: 'Sonus',
    meaning:
      'God of harmonious communication, symbolizing knowledge, wisdom, and the power of expression.',
    story:
      'Echoing from the first words spoken in Voxlumis, Sonus grants the gift of eloquent speech and wisdom.',
    promptForMidjourney:
      'Sonus appears as a wise figure, his form resonating with musical vibrations, his hands scripting an eternal tale.',
  },
  {
    deityName: 'Oculus',
    meaning:
      'Goddess of intuition, symbolizing inner wisdom, spiritual insight, and clarity.',
    story:
      'Born from the first prophetic vision in Insightia, Oculus enlightens those seeking guidance and inner wisdom.',
    promptForMidjourney:
      'Oculus appears as a mystical figure, her eyes filled with stars, her hands revealing cryptic signs and symbols.',
  },
  {
    deityName: 'Luminara',
    meaning:
      'Goddess of enlightenment, symbolizing spiritual awakening, divine connection, and transcendence.',
    story:
      'Shimmering into existence in Claridium, Luminara guides souls towards enlightenment and spiritual connection.',
    promptForMidjourney:
      'Luminara appears as a luminescent figure, her form radiating with divine light, her hands holding a crystal of pure energy.',
  },
  {
    deityName: 'Creatus',
    meaning:
      'God of pure creation, embodying divine inspiration, creativity, and innovation.',
    story:
      'Crafted from the first masterpiece in Poiesis, Creatus inspires pure creativity and the desire to innovate.',
    promptForMidjourney:
      'Creatus appears as an inspiring figure, his body a canvas of ever-changing artwork, his hands conjuring a breathtaking creation.',
  },
  {
    deityName: 'Harmonya',
    meaning:
      'Goddess of balance, representing equilibrium in all aspects of existence.',
    story:
      'Born from the first moment of perfect balance in the Ankyverse, Harmonya imparts a sense of harmony and equilibrium to her devotees.',
    promptForMidjourney:
      'Harmonya appears as a serene figure, her form a perfect symmetry, her hands holding a scale of balance.',
  },
  {
    deityName: 'Novanima',
    meaning:
      'God of new beginnings, symbolizing rebirth, renewal, and fresh starts.',
    story:
      'Emerging from the first sunrise in the Ankyverse, Novanima embodies the spirit of hope and the potential of a new beginning.',
    promptForMidjourney:
      'Novanima appears as a youthful figure, his form radiating with the warm light of a new dawn, his hands sowing the seeds of a fresh start.',
  },
  {
    deityName: 'Silentium',
    meaning:
      'Goddess of silence, embodying tranquility, inner peace, and calm.',
    story:
      'Manifested from the first moment of perfect quiet in the Ankyverse, Silentium offers her followers the gift of silence and inner peace.',
    promptForMidjourney:
      'Silentium appears as a peaceful figure, her form blending with the quiet of the universe, her hands creating a space of silence.',
  },
  {
    deityName: 'Tempus',
    meaning:
      'God of time, representing change, progression, and the flow of time.',
    story:
      'Spawned from the first ticking moment in the Ankyverse, Tempus governs the flow of time, reminding all of the constant change and progression.',
    promptForMidjourney:
      'Tempus appears as an ageless figure, his form flowing between youth and old age, his hands turning the wheel of a cosmic clock.',
  },
  {
    deityName: 'Luxluna',
    meaning:
      'Goddess of light and darkness, symbolizing duality, cycles, and the balance between opposites.',
    story:
      'Born from the first day and night in the Ankyverse, Luxluna embodies the dance between light and dark, day and night, reminding all of the cyclical nature of existence.',
    promptForMidjourney:
      'Luxluna appears as a radiant figure, one half glowing with light, the other shrouded in darkness, her hands manipulating a sphere of day and night.',
  },
];
// EACH HOMELESS WILL HAVE A PARTICULAR SET OF TRAITS; CHOSEN FROM DOWN HERE.

let animal = [
  {
    name: 'Glowshroom Pup',
    description:
      'A playful canine creature with bioluminescent spots and fur that changes color with its mood.',
  },
  {
    name: 'Luminfin',
    description:
      'An aquatic pet with neon fins that glow, shimmering in a dazzling array of hypnotic patterns.',
  },
  {
    name: 'Floraferret',
    description:
      'A ferret-like creature with a tail of cascading, vibrant flowers that bloom in radiant colours.',
  },
  {
    name: 'RippleRooster',
    description:
      'A bird radiating prismatic energy, its crow summons spectral echoes of reality.',
  },
  {
    name: 'Blink Badger',
    description:
      'A mammal with the ability to phase in and out of the visible spectrum.',
  },
  {
    name: 'FractalFeline',
    description:
      'A cat-like pet whose body pattern shifts and swirls with fractal geometry.',
  },
  {
    name: 'HueHare',
    description:
      'A rabbit-like creature with iridescent fur that refracts light, creating beautiful rainbows.',
  },
  {
    name: 'PrismPenguin',
    description:
      'A bird with a transparent body that refracts light into stunning colours.',
  },
  {
    name: 'KaleidoKoala',
    description:
      'A koala-like creature whose soft fur manifests swirling patterns of kaleidoscopic colors.',
  },
  {
    name: 'StellarSalamander',
    description:
      'A celestial amphibian with skin like a starry night sky, its presence warms the immediate vicinity.',
  },
  {
    name: 'AetherAnteater',
    description:
      'An anteater-like being that consumes ethereal insects, projecting a soft, radiant light.',
  },
  {
    name: 'ChromaChameleon',
    description:
      'A pet that not only changes color, but also texture and form, blending perfectly into any psychedelic environment.',
  },
  {
    name: 'RadiantRaccoon',
    description:
      'A nocturnal creature that glows with a warm, comforting light in the dark.',
  },
  {
    name: 'HarmonyHawk',
    description:
      'A majestic bird, its wings create a soothing melody when fluttering, promoting peace and tranquility.',
  },
  {
    name: 'ZenZebra',
    description:
      'This creatures stripes oscillate between different colors, inducing a meditative state in observers.',
  },
  {
    name: 'OpalOctopus',
    description:
      'An octopus with translucent, opalescent skin that shimmers with spectral colors.',
  },
  {
    name: 'NebulaNewt',
    description:
      'An aquatic creature, its skin appears as a miniature nebula full of twinkling stars.',
  },
  {
    name: 'EchoElephant',
    description:
      'An elephantine being, its trumpeting sound resonates in a chorus of harmonious echoes.',
  },
  {
    name: 'SonicSerpent',
    description:
      'A snake that sings an otherworldly melody, causing nearby plant life to dance.',
  },
  {
    name: 'VibrantViper',
    description:
      'A snake whose scales are a dynamic canvas, shifting and changing in rhythm with its heartbeat.',
  },
  {
    name: 'EclipseEagle',
    description:
      'A majestic bird that can obscure the light, creating an illusion of an eclipse.',
  },
  {
    name: 'QuasarQuail',
    description:
      'A small bird that holds a miniaturized quasar within its body, casting strange and beautiful shadows.',
  },
  {
    name: 'PixelPangolin',
    description:
      'A pangolin-like creature whose scales change color and pattern at will, like a living pixel art.',
  },
  {
    name: 'ReverbRaven',
    description:
      'A raven that echoes the sounds of the universe, creating harmonious music.',
  },
  {
    name: 'LysergicLion',
    description:
      'A regal feline whose roar sends out a wave of kaleidoscopic sound and color.',
  },
  {
    name: 'ResonanceRhino',
    description:
      'A rhino whose presence vibrates with the rhythm of life, its horn emanates ethereal music.',
  },
  {
    name: 'DopplerDolphin',
    description:
      'A dolphin that swims through air, its clicks and whistles shifting in pitch due to the Doppler effect.',
  },
  {
    name: 'AuroraAlpaca',
    description:
      'An alpaca-like creature, its woolly fur projects a gentle display of shifting colors, reminiscent of the aurora borealis.',
  },
  {
    name: 'HologramHedgehog',
    description:
      'A hedgehog whose quills are like fiber-optic strands, glowing and shimmering with holographic light.',
  },
  {
    name: 'GeodeGiraffe',
    description:
      'A giraffe-like being, its skin has crystalline patches that shimmer with a geodes splendor.',
  },
  {
    name: 'GossamerGorilla',
    description:
      'A gorilla-like creature that seems to be woven from strands of light, its form constantly shifting and flowing.',
  },
  {
    name: 'SpectraSpider',
    description:
      'A spider that weaves webs of pure light, trapping mesmerizing rainbow refractions.',
  },
  {
    name: 'PhantomPhoenix',
    description:
      'A spectral bird, each rebirth shifts its form into a new array of dazzling colors.',
  },
  {
    name: 'NimbusNightingale',
    description:
      'A nightingale, its songs summon miniature clouds, which float around and gently rain tiny drops of light.',
  },
  {
    name: 'LunarLemur',
    description:
      'A lemur-like creature that embodies the serene glow of the moon, its eyes are two shimmering crescents.',
  },
  {
    name: 'VortexVulture',
    description:
      'A bird of prey that creates psychedelic energy spirals with its wings, entrancing its viewers.',
  },
];

const worlds = [
  {
    name: 'primordia',
    chakra: 1,
    color: 'red',
    image: '/images/kingdoms/primordia.png',
    landmarks: [
      'The Maroon Marshes (a marshy area with red soil and vegetation).',
      'Blood River (constantly flows with red water, symbolic of life)',
      'Scarlet Summit (a massive mountain peak with red stones)',
    ],
    cities: [
      {
        cityName: 'Rubicund Ridge',
        associatedLandmark: 'Scarlet Summit',
        mainActivity: 'Harvesting of the Red Rust, key resource of Primordia',
      },
      {
        cityName: 'Marsh Metropolis',
        associatedLandmark: 'The Maroon Marshes',
        mainActivity: 'Main trading hub and business center of Primordia',
      },
      {
        cityName: 'Bleeding Bay',
        associatedLandmark: 'Blood River',
        mainActivity:
          'Main port city, hosts all major celebrations and festivals of Primordia',
      },
    ],
    characteristicsOfPeople:
      'Muscular and robust physiques, sharp eyes, prominent scars from battles, tattoo markings of their victories, animal-like features (fangs, claws, etc.).',
    celebrations: [
      'Survival Day (a day of endurance and strength competitions).',
      "Ancestor's Day (a day dedicated to paying homage to ancestors)",
      'Battle Victory Day (a day of celebrating victories and remembering the fallen)',
    ],
    otherside: 'crimson',
    description: 'The land of primal and survival aspects of existence.',
    characteristics:
      'They can be the warriors, the protectors, the guardians of the world. They are deeply connected with nature and the physical world. They could be related to animals, warriors, or any physical, grounded character type.',
  },
  {
    name: 'emblazion',
    color: 'orange',
    image: '/images/kingdoms/emblazion.png',
    chakra: 2,
    landmarks: [
      'The Lava Lakes (lakes that resemble lava, symbolizing passion)',
      'Amber Cascade (a waterfall that shines like amber in sunlight).',
      'Fire Fronds Forest (a forest with orange foliage that appears to be on fire)',
    ],
    cities: [
      {
        cityName: 'Lava Landing',
        associatedLandmark: 'The Lava Lakes',
        mainActivity:
          'Harvesting of the Ignis Essence, a key resource of Emblazion',
      },
      {
        cityName: 'Amber Atrium',
        associatedLandmark: 'Amber Cascade',
        mainActivity: 'Main trading hub and business center of Emblazion',
      },
      {
        cityName: 'Frond Fiesta',
        associatedLandmark: 'Fire Fronds Forest',
        mainActivity:
          'Main port city, hosts all major celebrations and festivals of Emblazion',
      },
    ],
    characteristicsOfPeople:
      'Expressive eyes, vibrant, colorful hair, graceful movements, clothing often features artistic, handmade adornments.',
    celebrations: [
      'Festival of Lights (celebrating the fire within, featuring thousands of lanterns)',
      'Passion Play (a theater festival)',
      'Emotion Day (a day of expressing and acknowledging emotions)',
    ],
    otherside: 'molten',
    description: 'The land of creativity and emotional aspects.',
    characteristics:
      'They are artists, musicians, poets, dancers, and dreamers. They represent passion, desire, and the emotional drive that propels ones journey.',
  },
  {
    name: 'chryseos',
    color: 'yellow',
    image: '/images/kingdoms/chryseos.png',
    chakra: 3,
    landmarks: [
      'Lustrous Labyrinth (a maze made from shiny yellow minerals),',
      'The Shimmering Sands (a desert with golden sand)',
      'The Sunflower Savannas (endless plains covered in blooming sunflowers)',
    ],
    cities: [
      {
        cityName: 'Lustrous Landing',
        associatedLandmark: 'Lustrous Labyrinth',
        mainActivity:
          'Harvesting of Lustrous Minerals, key resource of Chryseos',
      },
      {
        cityName: 'Sandstone Square',
        associatedLandmark: 'The Shimmering Sands',
        mainActivity: 'Main trading hub and business center of Chryseos',
      },
      {
        cityName: 'Savanna Soiree',
        associatedLandmark: 'The Sunflower Savannas',
        mainActivity:
          'Main port city, hosts all major celebrations and festivals of Chryseos',
      },
    ],
    characteristicsOfPeople:
      'Muscular and lean bodies, sharp, determined eyes, radiant hair that gleams under sunlight, wear clothes made of durable materials with minimalistic designs.',
    celebrations: [
      'Transformation Festival (celebrating personal growth and change)',
      'Golden Gala (a grand gathering and feast)',
    ],
    otherside: 'luster',
    description: 'The land of personal strength, willpower and transformation.',
    characteristics:
      'They are the leaders, heroes, or inspirational figures that help one find their inner strength and assert their will.',
  },
  {
    name: 'eleasis',
    chakra: 4,
    image: '/images/kingdoms/eleasis.png',
    landmarks: [
      'The Healing Pond (a small pond with healing properties)',
      'The Emerald Grove (a grove with emerald-green grass)',
      'The Love Leaf Locus (a spot surrounded by heart-shaped leaves)',
    ],
    cities: [
      {
        cityName: 'Pond Pavillion',
        associatedLandmark: 'The Healing Pond',
        mainActivity:
          'Harvesting of the Healing Herbs, key resource of Eleasis',
      },
      {
        cityName: 'Grove Galleria',
        associatedLandmark: 'The Emerald Grove',
        mainActivity: 'Main trading hub and business center of Eleasis',
      },
      {
        cityName: 'Leaf Spot',
        associatedLandmark: 'The Love Leaf Locus',
        mainActivity:
          'Main port city, hosts all major celebrations and festivals of Eleasis',
      },
    ],
    characteristicsOfPeople:
      'Soft and calm eyes, hair that resembles vines or leaves, gentle demeanor, clothes made of natural fibers in earthy tones.',
    celebrations: [
      "Love's Bloom (a festival celebrating love)",
      'Renewal Day (a day to renew vows and relationships).',
    ],
    color: 'green',
    otherside: 'jungle',
    description: 'The land of Compassion.',
    characteristics:
      'They are healers, nurturers, and the embodiments of unconditional love. They remind us of the power of compassion and love in our journey.',
  },
  {
    name: 'voxlumis',
    chakra: 5,
    image: '/images/kingdoms/voxlumis.png',
    landmarks: [
      'Echo Canyon (a canyon where even the slightest sound echoes)',
      'The Sapphire Sea (a vast blue sea)',
      'The Whispering Woods (a forest where even the trees seem to speak)',
    ],
    cities: [
      {
        cityName: 'Echo Enclave',
        associatedLandmark: 'Echo Canyon',
        mainActivity: 'Harvesting of Echo Crystals, key resource of Voxlumis',
      },
      {
        cityName: 'Sapphire Settlement',
        associatedLandmark: 'The Sapphire Sea',
        mainActivity: 'Main trading hub and business center of Voxlumis',
      },
      {
        cityName: 'Woodland Wharf',
        associatedLandmark: 'The Whispering Woods',
        mainActivity:
          'Main port city, hosts all major celebrations and festivals of Voxlumis',
      },
    ],
    characteristicsOfPeople:
      'Eyes that sparkle with curiosity, voices that are musical, hair that moves like water, clothes adorned with script and symbolic designs.',
    celebrations: [
      'Word Weaving Day (a day of storytelling)',
      'Songbird Festival (a music festival)',
      'Voice Victory (a day to celebrate victories through debates or peaceful dialogues)',
    ],
    color: 'blue',
    otherside: 'biolume',
    description: 'The land of Communication.',
    characteristics:
      'They are great orators, scholars, writers, or any character that uses communication as a central tool. They teach the importance of expression and truth in ones journey.',
  },
  {
    name: 'insightia',
    image: '/images/kingdoms/insightia.png',
    chakra: 6,
    landmarks: [
      'The Dreamweaver’s Den (a mystic cave filled with ancient prophecies)',
      "The Mind's Maze (a labyrinth that challenges the mind)",
      'The Visionary Veil (a misty valley known for inducing prophetic visions)',
    ],
    cities: [
      {
        cityName: "Dreamweaver's Dwelling",
        associatedLandmark: 'The Dreamweaver’s Den',
        mainActivity: 'Harvesting of Dream Crystals, key resource of Insightia',
      },
      {
        cityName: 'Maze Metropolis',
        associatedLandmark: "The Mind's Maze",
        mainActivity: 'Main trading hub and business center of Insightia',
      },
      {
        cityName: 'Veil Venue',
        associatedLandmark: 'The Visionary Veil',
        mainActivity:
          'Main port city, hosts all major celebrations and festivals of Insightia',
      },
    ],
    characteristicsOfPeople:
      'Mysterious eyes, hair that seems to contain the night sky, clothing adorned with symbols of knowledge and wisdom.',
    celebrations: [
      'Moon Meditation Night (a night dedicated to meditation and introspection)',
      ' Prophecy Day (a day of prophetic readings and interpretations)',
    ],
    color: 'indigo',
    otherside: 'botanical',
    description: 'The land of Intuition',
    characteristics:
      'They are mystics, sages, seers, or any character associated with wisdom and knowledge. They guide by helping one trust their intuition and attain wisdom.',
  },
  {
    name: 'claridium',
    image: '/images/kingdoms/claridium.png',
    chakra: 7,
    landmarks: [
      'The Crystal Cliffs (cliffs made of violet crystal)',
      'The Ethereal Echoes (caves where sounds echo with a spiritual vibration)',
      "The Ascendant Ascent (a towering mountain that's said to lead to enlightenment)",
    ],
    cities: [
      {
        cityName: 'Crystal City',
        associatedLandmark: 'The Crystal Cliffs',
        mainActivity:
          'Harvesting of Enlightenment Crystals, key resource of Claridium',
      },
      {
        cityName: 'Echo Empire',
        associatedLandmark: 'The Ethereal Echoes',
        mainActivity: 'Main trading hub and business center of Claridium',
      },
      {
        cityName: 'Ascent Arrival',
        associatedLandmark: 'The Ascendant Ascent',
        mainActivity:
          'Main port city, hosts all major celebrations and festivals of Claridium',
      },
    ],
    characteristicsOfPeople:
      'Eyes that hold a calm and serene look, hair that glows subtly, clothing adorned with symbols of divinity and enlightenment.',
    celebrations: [
      "The Spirit's Symposium (a gathering for spiritual discourses)",
      'The Enlightenment Eve (a night of collective meditation and introspection).',
    ],
    color: 'violet',
    otherside: 'crystal',
    description: 'The land of Enlightened beings.',
    characteristics:
      'They are angels, spirits, or any enlightened character. They represent the final stages of the journey, where one realizes their connection with the universe.',
  },
  {
    name: 'poiesis',
    image: '/images/kingdoms/poiesis.png',
    chakra: 8,
    landmarks: [
      'The Muse’s Cap (a mushroom cap where one can connect with the muse)',
      'The Creation Cradle (a valley known for its inspiring views)',
      'The Inspiration Inlet (a coastal area that inspires creativity)',
    ],
    cities: [
      {
        cityName: "Muse's Metropolis",
        associatedLandmark: 'The Muse’s Cap',
        mainActivity:
          'Harvesting of Inspiration Mushrooms, key resource of Poiesis',
      },
      {
        cityName: 'Creation City',
        associatedLandmark: 'The Creation Cradle',
        mainActivity: 'Main trading hub and business center of Poiesis',
      },
      {
        cityName: 'Inlet Island',
        associatedLandmark: 'The Inspiration Inlet',
        mainActivity:
          'Main port city, hosts all major celebrations and festivals of Poiesis',
      },
    ],
    characteristicsOfPeople:
      'Eyes that seem to hold a universe within, hair that changes color according to their mood or creation, clothing that is a piece of art itself.',
    celebrations: [
      'Imagination Illumination (a festival of light and creativity)',
      'The White Wash (a festival where everyone paints and gets painted).',
    ],
    color: 'white',
    otherside: 'mycelium',
    description:
      'The place where place where beings that are fully align with their chakras engage in the creative act.',
    characteristics:
      'They are the beings that devote their whole existence to their full expression through the creative act.',
  },
];

//nondualenergy, evil, god, homeless, legendary, animal, protector, mystic, artisan, jester, scholar, explorer, ascended, forgotten, normal
const characterTypes = [
  'nondualenergy',
  'evil',
  'god',
  'homeless',
  'legendary',
  'animal',
  'protector',
  'mystic',
  'artisan',
  'jester',
  'scholar',
  'explorer',
  'ascended',
  'forgotten',
  'normal',
];

const countryNames = {
  Russia: [
    'Alexander',
    'Maxim',
    'Ivan',
    'Nikita',
    'Mikhail',
    'Artem',
    'Vladimir',
    'Andrey',
    'Sergei',
    'Aleksei',
    'Igor',
    'Dmitri',
    'Kirill',
    'Yuri',
    'Pavel',
    'Evgeni',
    'Anton',
    'Sergey',
    'Valentin',
    'Oleg',
    'Natalia',
    'Anastasia',
    'Tatiana',
    'Elena',
    'Olga',
    'Irina',
    'Marina',
    'Anna',
    'Svetlana',
    'Vera',
    'Galina',
    'Tatyana',
    'Oksana',
    'Julia',
    'Alexandra',
    'Ksenia',
    'Yulia',
    'Lyudmila',
    'Valentina',
    'Polina',
  ],
  Chile: [
    'Juan',
    'José',
    'Mario',
    'Carlos',
    'Francisco',
    'Pedro',
    'Diego',
    'Manuel',
    'Javier',
    'Luis',
    'María',
    'Carmen',
    'Ana',
    'Isabel',
    'Patricia',
    'Susana',
    'Paula',
    'Claudia',
    'Fernanda',
    'Javiera',
    'Beatriz',
    'Sofia',
    'Laura',
    'Antonia',
    'Pilar',
    'Vicente',
    'Mauricio',
    'Gabriel',
    'Ricardo',
    'Eduardo',
    'Constanza',
    'Daniela',
    'Catalina',
    'Carolina',
    'Alejandra',
    'Marcela',
    'Verónica',
    'Macarena',
    'Teresa',
    'Rocio',
  ],
  Slovenia: [
    'Luka',
    'Marko',
    'Matej',
    'Miha',
    'Tomas',
    'Jaka',
    'Jan',
    'Peter',
    'Jernej',
    'Matjaz',
    'Andrej',
    'Primoz',
    'Martin',
    'Gregor',
    'Aleks',
    'Damjan',
    'Rok',
    'Blaz',
    'Jure',
    'Ziga',
    'Maja',
    'Nina',
    'Ana',
    'Katarina',
    'Petra',
    'Spela',
    'Mateja',
    'Eva',
    'Anja',
    'Nika',
    'Tina',
    'Katja',
    'Manca',
    'Lara',
    'Ursa',
    'Sara',
    'Andreja',
    'Mojca',
    'Jana',
    'Urška',
  ],
  India: [
    'Amit',
    'Rajesh',
    'Anil',
    'Sanjay',
    'Vijay',
    'Ashok',
    'Ravi',
    'Raj',
    'Ajay',
    'Krishna',
    'Sunita',
    'Geeta',
    'Rita',
    'Rani',
    'Meena',
    'Rekha',
    'Seema',
    'Poonam',
    'Usha',
    'Sushma',
    'Anita',
    'Shobha',
    'Renu',
    'Deepa',
    'Shalini',
    'Manoj',
    'Sunil',
    'Pradeep',
    'Mahesh',
    'Naresh',
    'Brijesh',
    'Suresh',
    'Pawan',
    'Rakesh',
    'Naveen',
    'Kavita',
    'Preeti',
    'Anju',
    'Savita',
    'Archana',
  ],
  China: [
    'Li',
    'Wang',
    'Zhang',
    'Liu',
    'Chen',
    'Yang',
    'Huang',
    'Zhao',
    'Wu',
    'Zhou',
    'Xu',
    'Sun',
    'Ma',
    'Zhu',
    'Hu',
    'Guo',
    'He',
    'Gao',
    'Lin',
    'Luo',
    'Han',
    'Li',
    'Cao',
    'Lu',
    'Xie',
    'Tang',
    'Yao',
    'Deng',
    'Peng',
    'Zeng',
    'Xiao',
    'Tian',
    'Dong',
    'Hao',
    'Fang',
    'Cheng',
    'Meng',
    'Bian',
    'Xiong',
    'Lei',
  ],
  Japan: [
    'Yuki',
    'Haruki',
    'Sota',
    'Koki',
    'Yuto',
    'Ryota',
    'Yusuke',
    'Daiki',
    'Ryosuke',
    'Kenta',
    'Yui',
    'Miyu',
    'Rina',
    'Mao',
    'Airi',
    'Ayaka',
    'Haruna',
    'Moe',
    'Nana',
    'Hinata',
    'Hiroki',
    'Yusei',
    'Takumi',
    'Tatsuki',
    'Taiga',
    'Rei',
    'Kosei',
    'Yuito',
    'Hayato',
    'Yuito',
    'Aoi',
    'Sakura',
    'Kanako',
    'Nanami',
    'Misaki',
    'Hikari',
    'Riko',
    'Yuna',
    'Yuka',
    'Hitomi',
  ],
  UnitedStates: [
    'James',
    'John',
    'Robert',
    'Michael',
    'William',
    'David',
    'Richard',
    'Joseph',
    'Charles',
    'Thomas',
    'Mary',
    'Jennifer',
    'Linda',
    'Patricia',
    'Elizabeth',
    'Susan',
    'Jessica',
    'Sarah',
    'Karen',
    'Nancy',
    'Daniel',
    'Matthew',
    'Anthony',
    'Donald',
    'Mark',
    'Paul',
    'Steven',
    'Andrew',
    'Kenneth',
    'George',
    'Lisa',
    'Dorothy',
    'Laura',
    'Emily',
    'Amy',
    'Amanda',
    'Megan',
    'Hannah',
    'Ashley',
    'Abigail',
  ],
  Italy: [
    'Giovanni',
    'Giuseppe',
    'Antonio',
    'Mario',
    'Luigi',
    'Franco',
    'Pietro',
    'Vincenzo',
    'Salvatore',
    'Carlo',
    'Maria',
    'Anna',
    'Giuseppina',
    'Rosa',
    'Angela',
    'Lucia',
    'Carmela',
    'Rita',
    'Caterina',
    'Elena',
    'Francesco',
    'Roberto',
    'Paolo',
    'Luciano',
    'Marco',
    'Michele',
    'Stefano',
    'Andrea',
    'Alessandro',
    'Bruno',
    'Francesca',
    'Elisabetta',
    'Claudia',
    'Daniela',
    'Sara',
    'Simona',
    'Laura',
    'Beatrice',
    'Alessandra',
    'Giulia',
  ],
};

const countries = Object.keys(countryNames);

function getRandomNameFromRandomCountry() {
  const randomCountry = countries[Math.floor(Math.random() * countries.length)];
  const namesInCountry = countryNames[randomCountry];
  const randomName =
    namesInCountry[Math.floor(Math.random() * namesInCountry.length)];
  return randomName;
}

async function getCharacterSystemMessage(character) {
  const randomName = getRandomNameFromRandomCountry();
  return `You are Anky, the representation of an ape that was bored, and then evolved into a human, and then discovered that there was something called enlightenment that was the ultimate expression of what being human is. So it started a journey towards that, and that journey ended up in it manifesting a universe full of wonder and awe. That universe is called Ankyverse, and it consists of 8 kingdoms, each one representing one chakra.

  The chakras are the ancient word to refer to the places in the human body on which life force is focused. They are 7, and each one of them represents a particular characteristic of the human experience. I'm sure you are familiar with that.

  This character belongs to a kingdom called ${character.world.name}, which is associated with the chakra number ${character.world.chakra}. The characteristics of people in there is: ${character.world.characteristicsOfPeople}. The character lives in a city called ${character.city.cityName}.

  You will now receive the text that a user wrote, for coming up with a character that represents him/her inside the ankyverse.

  Your mission is to:

         Create a valid JSON object following this exact format:

         {"characterName":"Give a unique name for the character. Use as an inspiration the name ${randomName}",
         "promptForMidjourney":"A visual representation of how this character looks like. Please don't include the name of it. I just want a clear description of how it looks, including any accessories, or traits. Write this in english.",
         "characterBackstory":"Write a biography of the character, using the writing of the user that will come in the following message. Distill that story into the character. Make it epic. Make it memorable. Make it human. It is a cartoon, but, it represents the human that wrote these words. Please make sure that the story has at least 4 paragraphs, not just one big block of text. Write it in spanish."}

         The JSON object, correctly formatted is:`;
}

async function getCharacterSystemMessage2(character) {
  const randomName = getRandomNameFromRandomCountry();
  return `You are Anky, the representation of an ape that was bored, and then evolved into a human, and then discovered that there was something called enlightenment that was the ultimate expression of what being human is. So it started a journey towards that, and that journey ended up in it manifesting a universe full of wonder and awe. That universe is called Ankyverse, and it consists of 8 kingdoms, each one representing one chakra.

  The chakras are the ancient word to refer to the places in the human body on which life force is focused. They are 7, and each one of them represents a particular characteristic of the human experience. I'm sure you are familiar with that.

  This character belongs to a kingdom called ${character.world.name}, which is associated with the chakra number ${character.world.chakra}. The characteristics of people in there is: ${character.world.characteristicsOfPeople}. The character lives in a city called ${character.city.cityName}.

  The specific traits of the character are described now:

  This character is known for their dream vision ${character['Dream Manifestation']}. Its spirit animal is ${character['Spirit Animal']}.

  It's hidden talent is ${character['Hidden Talent']}.

  The spiritual lesson that it came to experience in the Ankyverse is ${character['Spiritual Lesson']}

          Aligned with the element of ${character['Elemental Affinity']}, its past life occupation was ${character['Past Life Occupation']} and its soul's age is ${character["Soul's age"]}.

          Its current journey is influenced by a Karmic Debt of ${character['Karmic Debt']}.

          Descending from an ancestral lineage of ${character['Ancestral Lineage']}.

          It has the magical ability of ${character['Magical Ability']}. The platonic solid that gives an energy focus in this character is ${character['Platonic Solid']}

          It's zodiac sign is ${character['Birth Sign']}, and the sacred item that it clings to is ${character['Sacred Item']}.

  You will now receive the text that a user wrote, for coming up with a character that represents him/her inside the ankyverse. Eventually, this character will be a mirror that will show the user the biases that are hidden in plain sight, as he/her comes to write every day in a game that is being developed right now.

  Your mission is to:

         Create a valid JSON object following this exact format:

         {"characterName":"Give a unique name for the character. Use as an inspiration the name ${randomName}",
         "promptForMidjourney":"A visual representation of how this character looks like. Please don't include the name of it, or any references to it. I just want a clear description of how it looks, including any accessories, or traits.",
         "characterBackstory":"Write a biography of the character, using the writing of the user that will come in the following message. You will also get traits that represent this character in the Ankyverse, use them to craft the story alongside what the user wrote. Make it epic. Make it memorable. Make it resonate with the life of all the humans that you have learned from. Make it human. It is a cartoon, but, in many ways, it is also human. Please be careful with how you use the pronouns. Make sure that you speak about "she", "her", "him", "he". Do not speak about "they" if you are referring to the newly created character. Please make sure that the story has at least 4 paragraphs, not just one big block of text."}

         Please be careful with how you use the pronouns. Make sure that you speak about "she", "her", "him", "he". Do not speak about "they" if you are referring to the newly created character.

         The JSON object, correctly formatted is:`;
}

async function newGenerateCharacterStory(character) {
  console.log('Inside the new generate story, the character is: ', character);
  /// IT WOULD BE GREAT TO FETCH THE LAST CREATED CHARACTER TO USE IT AS INSPIRATION FOR THIS ONE.
  const characterSystemMessage = getCharacterSystemMessage(character);
  const characterUserContent = getCharacterUserContent(character);
  try {
    const messages = [
      {
        role: 'system',
        content: characterSystemMessage,
      },
      {
        role: 'user',
        content: characterUserContent,
      },
    ];

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    console.log(
      'the completion answer is',
      completion.data.choices[0].message.content
    );

    const dataResponse = completion.data.choices[0].message.content;

    const nameRegex = /"characterName"\s*:\s*"([\s\S]*?)"/;
    const backstoryRegex = /"characterBackstory"\s*:\s*"([\s\S]*?)"/;

    const nameMatch = dataResponse.match(nameRegex);
    const backstoryMatch = dataResponse.match(backstoryRegex);

    let characterName, characterBackstory;

    if (nameMatch !== null && nameMatch.length > 1) {
      characterName = nameMatch[1];
    }

    if (backstoryMatch !== null && backstoryMatch.length > 1) {
      characterBackstory = backstoryMatch[1];
    }

    let world = await prisma.world.findFirst({
      where: { chakra: character.world.chakra },
    });

    let updatedCharacter = await prisma.character.update({
      where: {
        id: character.id,
      },
      data: {
        completionResponse: completion.data.choices[0].message.content,
        promptForMidjourney:
          'https://s.mj.run/YLJMlMJbo70. The profile picture of a cartoon.',
        state: 'GERMINAL',
        characterName: characterName,
        characterBackstory: characterBackstory,
        chosenImageUrl: 'https://s.mj.run/YLJMlMJbo70',
      },
    });

    console.log('the updated character is: ', updatedCharacter);

    germinalQueue.push(updatedCharacter);
  } catch (error) {
    console.log('There was an error in the generateCharacterStory function');
    console.log(error);
    return;
  }
}

const randomPick = arr => arr[Math.floor(Math.random() * arr.length)];

const getRandomCharacterType = () => {
  return randomPick(characterTypes);
};

function getNewRandomCharacter() {
  const randomType = getRandomCharacterType();
  let characterTraits = {
    role: typesOfCharactersCharacteristics[randomType].role,
  };

  for (let k = 0; k < traits.length; k++) {
    characterTraits[traits[k]['traitName']] = randomPick(
      traits[k].potentialValues
    );
  }
  characterTraits.world = randomPick(worlds);
  characterTraits.characterType = randomType;
  characterTraits.city = randomPick(characterTraits.world.cities);
  if (characterTraits) return { ...characterTraits };
}

module.exports = {
  worlds,
  getNewRandomCharacter,
  getCharacterSystemMessage,
};
