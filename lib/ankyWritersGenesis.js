require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const prisma = require("../lib/prismaClient");
const fs = require("fs");
const { getAddrByFid } = require("../lib/neynar");
const { ethers } = require("ethers");
const { Readable } = require("stream");
const sharp = require("sharp");
const path = require("path");
const { v2 } = require("cloudinary");
const { OpenAI } = require("openai");

const worlds = [
  {
    name: "primordia",
    chakra: 1,
    color: "red",
    landmarks: [
      "The Maroon Marshes (a marshy area with red soil and vegetation).",
      "Blood River (constantly flows with red water, symbolic of life)",
      "Scarlet Summit (a massive mountain peak with red stones)",
    ],
    cities: [
      {
        cityName: "Rubicund Ridge",
        associatedLandmark: "Scarlet Summit",
        mainActivity: "Harvesting of the Red Rust, key resource of Primordia",
      },
      {
        cityName: "Marsh Metropolis",
        associatedLandmark: "The Maroon Marshes",
        mainActivity: "Main trading hub and business center of Primordia",
      },
      {
        cityName: "Bleeding Bay",
        associatedLandmark: "Blood River",
        mainActivity:
          "Main port city, hosts all major celebrations and festivals of Primordia",
      },
    ],
    characteristicsOfPeople:
      "Muscular and robust physiques, sharp eyes, prominent scars from battles, tattoo markings of their victories, animal-like features (fangs, claws, etc.).",
    celebrations: [
      "Survival Day (a day of endurance and strength competitions).",
      "Ancestor's Day (a day dedicated to paying homage to ancestors)",
      "Battle Victory Day (a day of celebrating victories and remembering the fallen)",
    ],
    otherside: "crimson",
    description: "The land of primal and survival aspects of existence.",
    characteristics:
      "They can be the warriors, the protectors, the guardians of the world. They are deeply connected with nature and the physical world. They could be related to animals, warriors, or any physical, grounded character type.",
  },
  {
    name: "emblazion",
    color: "orange",
    chakra: 2,
    landmarks: [
      "The Lava Lakes (lakes that resemble lava, symbolizing passion)",
      "Amber Cascade (a waterfall that shines like amber in sunlight).",
      "Fire Fronds Forest (a forest with orange foliage that appears to be on fire)",
    ],
    cities: [
      {
        cityName: "Lava Landing",
        associatedLandmark: "The Lava Lakes",
        mainActivity:
          "Harvesting of the Ignis Essence, a key resource of Emblazion",
      },
      {
        cityName: "Amber Atrium",
        associatedLandmark: "Amber Cascade",
        mainActivity: "Main trading hub and business center of Emblazion",
      },
      {
        cityName: "Frond Fiesta",
        associatedLandmark: "Fire Fronds Forest",
        mainActivity:
          "Main port city, hosts all major celebrations and festivals of Emblazion",
      },
    ],
    characteristicsOfPeople:
      "Expressive eyes, vibrant, colorful hair, graceful movements, clothing often features artistic, handmade adornments.",
    celebrations: [
      "Festival of Lights (celebrating the fire within, featuring thousands of lanterns)",
      "Passion Play (a theater festival)",
      "Emotion Day (a day of expressing and acknowledging emotions)",
    ],
    otherside: "molten",
    description: "The land of creativity and emotional aspects.",
    characteristics:
      "They are artists, musicians, poets, dancers, and dreamers. They represent passion, desire, and the emotional drive that propels ones journey.",
  },
  {
    name: "chryseos",
    color: "yellow",
    chakra: 3,
    landmarks: [
      "Lustrous Labyrinth (a maze made from shiny yellow minerals),",
      "The Shimmering Sands (a desert with golden sand)",
      "The Sunflower Savannas (endless plains covered in blooming sunflowers)",
    ],
    cities: [
      {
        cityName: "Lustrous Landing",
        associatedLandmark: "Lustrous Labyrinth",
        mainActivity:
          "Harvesting of Lustrous Minerals, key resource of Chryseos",
      },
      {
        cityName: "Sandstone Square",
        associatedLandmark: "The Shimmering Sands",
        mainActivity: "Main trading hub and business center of Chryseos",
      },
      {
        cityName: "Savanna Soiree",
        associatedLandmark: "The Sunflower Savannas",
        mainActivity:
          "Main port city, hosts all major celebrations and festivals of Chryseos",
      },
    ],
    characteristicsOfPeople:
      "Muscular and lean bodies, sharp, determined eyes, radiant hair that gleams under sunlight, wear clothes made of durable materials with minimalistic designs.",
    celebrations: [
      "Transformation Festival (celebrating personal growth and change)",
      "Golden Gala (a grand gathering and feast)",
    ],
    otherside: "luster",
    description: "The land of personal strength, willpower and transformation.",
    characteristics:
      "They are the leaders, heroes, or inspirational figures that help one find their inner strength and assert their will.",
  },
  {
    name: "eleasis",
    chakra: 4,
    landmarks: [
      "The Healing Pond (a small pond with healing properties)",
      "The Emerald Grove (a grove with emerald-green grass)",
      "The Love Leaf Locus (a spot surrounded by heart-shaped leaves)",
    ],
    cities: [
      {
        cityName: "Pond Pavillion",
        associatedLandmark: "The Healing Pond",
        mainActivity:
          "Harvesting of the Healing Herbs, key resource of Eleasis",
      },
      {
        cityName: "Grove Galleria",
        associatedLandmark: "The Emerald Grove",
        mainActivity: "Main trading hub and business center of Eleasis",
      },
      {
        cityName: "Leaf Spot",
        associatedLandmark: "The Love Leaf Locus",
        mainActivity:
          "Main port city, hosts all major celebrations and festivals of Eleasis",
      },
    ],
    characteristicsOfPeople:
      "Soft and calm eyes, hair that resembles vines or leaves, gentle demeanor, clothes made of natural fibers in earthy tones.",
    celebrations: [
      "Love's Bloom (a festival celebrating love)",
      "Renewal Day (a day to renew vows and relationships).",
    ],
    color: "green",
    otherside: "jungle",
    description: "The land of Compassion.",
    characteristics:
      "They are healers, nurturers, and the embodiments of unconditional love. They remind us of the power of compassion and love in our journey.",
  },
  {
    name: "voxlumis",
    chakra: 5,
    landmarks: [
      "Echo Canyon (a canyon where even the slightest sound echoes)",
      "The Sapphire Sea (a vast blue sea)",
      "The Whispering Woods (a forest where even the trees seem to speak)",
    ],
    cities: [
      {
        cityName: "Echo Enclave",
        associatedLandmark: "Echo Canyon",
        mainActivity: "Harvesting of Echo Crystals, key resource of Voxlumis",
      },
      {
        cityName: "Sapphire Settlement",
        associatedLandmark: "The Sapphire Sea",
        mainActivity: "Main trading hub and business center of Voxlumis",
      },
      {
        cityName: "Woodland Wharf",
        associatedLandmark: "The Whispering Woods",
        mainActivity:
          "Main port city, hosts all major celebrations and festivals of Voxlumis",
      },
    ],
    characteristicsOfPeople:
      "Eyes that sparkle with curiosity, voices that are musical, hair that moves like water, clothes adorned with script and symbolic designs.",
    celebrations: [
      "Word Weaving Day (a day of storytelling)",
      "Songbird Festival (a music festival)",
      "Voice Victory (a day to celebrate victories through debates or peaceful dialogues)",
    ],
    color: "blue",
    otherside: "biolume",
    description: "The land of Communication.",
    characteristics:
      "They are great orators, scholars, writers, or any character that uses communication as a central tool. They teach the importance of expression and truth in ones journey.",
  },
  {
    name: "insightia",
    chakra: 6,
    landmarks: [
      "The Dreamweaver’s Den (a mystic cave filled with ancient prophecies)",
      "The Mind's Maze (a labyrinth that challenges the mind)",
      "The Visionary Veil (a misty valley known for inducing prophetic visions)",
    ],
    cities: [
      {
        cityName: "Dreamweaver's Dwelling",
        associatedLandmark: "The Dreamweaver’s Den",
        mainActivity: "Harvesting of Dream Crystals, key resource of Insightia",
      },
      {
        cityName: "Maze Metropolis",
        associatedLandmark: "The Mind's Maze",
        mainActivity: "Main trading hub and business center of Insightia",
      },
      {
        cityName: "Veil Venue",
        associatedLandmark: "The Visionary Veil",
        mainActivity:
          "Main port city, hosts all major celebrations and festivals of Insightia",
      },
    ],
    characteristicsOfPeople:
      "Mysterious eyes, hair that seems to contain the night sky, clothing adorned with symbols of knowledge and wisdom.",
    celebrations: [
      "Moon Meditation Night (a night dedicated to meditation and introspection)",
      " Prophecy Day (a day of prophetic readings and interpretations)",
    ],
    color: "indigo",
    otherside: "botanical",
    description: "The land of Intuition",
    characteristics:
      "They are mystics, sages, seers, or any character associated with wisdom and knowledge. They guide by helping one trust their intuition and attain wisdom.",
  },
  {
    name: "claridium",
    chakra: 7,
    landmarks: [
      "The Crystal Cliffs (cliffs made of violet crystal)",
      "The Ethereal Echoes (caves where sounds echo with a spiritual vibration)",
      "The Ascendant Ascent (a towering mountain that's said to lead to enlightenment)",
    ],
    cities: [
      {
        cityName: "Crystal City",
        associatedLandmark: "The Crystal Cliffs",
        mainActivity:
          "Harvesting of Enlightenment Crystals, key resource of Claridium",
      },
      {
        cityName: "Echo Empire",
        associatedLandmark: "The Ethereal Echoes",
        mainActivity: "Main trading hub and business center of Claridium",
      },
      {
        cityName: "Ascent Arrival",
        associatedLandmark: "The Ascendant Ascent",
        mainActivity:
          "Main port city, hosts all major celebrations and festivals of Claridium",
      },
    ],
    characteristicsOfPeople:
      "Eyes that hold a calm and serene look, hair that glows subtly, clothing adorned with symbols of divinity and enlightenment.",
    celebrations: [
      "The Spirit's Symposium (a gathering for spiritual discourses)",
      "The Enlightenment Eve (a night of collective meditation and introspection).",
    ],
    color: "violet",
    otherside: "crystal",
    description: "The land of Enlightened beings.",
    characteristics:
      "They are angels, spirits, or any enlightened character. They represent the final stages of the journey, where one realizes their connection with the universe.",
  },
  {
    name: "poiesis",
    chakra: 8,
    landmarks: [
      "The Muse’s Cap (a mushroom cap where one can connect with the muse)",
      "The Creation Cradle (a valley known for its inspiring views)",
      "The Inspiration Inlet (a coastal area that inspires creativity)",
    ],
    cities: [
      {
        cityName: "Muse's Metropolis",
        associatedLandmark: "The Muse’s Cap",
        mainActivity:
          "Harvesting of Inspiration Mushrooms, key resource of Poiesis",
      },
      {
        cityName: "Creation City",
        associatedLandmark: "The Creation Cradle",
        mainActivity: "Main trading hub and business center of Poiesis",
      },
      {
        cityName: "Inlet Island",
        associatedLandmark: "The Inspiration Inlet",
        mainActivity:
          "Main port city, hosts all major celebrations and festivals of Poiesis",
      },
    ],
    characteristicsOfPeople:
      "Eyes that seem to hold a universe within, hair that changes color according to their mood or creation, clothing that is a piece of art itself.",
    celebrations: [
      "Imagination Illumination (a festival of light and creativity)",
      "The White Wash (a festival where everyone paints and gets painted).",
    ],
    color: "white",
    otherside: "mycelium",
    description:
      "The place where place where beings that are fully align with their chakras engage in the creative act.",
    characteristics:
      "They are the beings that devote their whole existence to their full expression through the creative act.",
  },
];

const fascinatingWriters = [
  { writer: "William Shakespeare", book: "Hamlet" },
  { writer: "Jane Austen", book: "Pride and Prejudice" },
  { writer: "Leo Tolstoy", book: "War and Peace" },
  { writer: "Gabriel García Márquez", book: "One Hundred Years of Solitude" },
  { writer: "Virginia Woolf", book: "To the Lighthouse" },
  { writer: "James Joyce", book: "Ulysses" },
  { writer: "Fyodor Dostoevsky", book: "Crime and Punishment" },
  { writer: "Homer", book: "The Odyssey" },
  { writer: "Mary Shelley", book: "Frankenstein" },
  { writer: "Charles Dickens", book: "Great Expectations" },
  { writer: "Haruki Murakami", book: "Kafka on the Shore" },
  { writer: "Mark Twain", book: "The Adventures of Huckleberry Finn" },
  { writer: "George Orwell", book: "1984" },
  { writer: "J.R.R. Tolkien", book: "The Lord of the Rings" },
  { writer: "Emily Dickinson", book: "The Collected Poems of Emily Dickinson" },
  { writer: "Edgar Allan Poe", book: "The Tell-Tale Heart and Other Writings" },
  { writer: "Toni Morrison", book: "Beloved" },
  { writer: "Franz Kafka", book: "The Metamorphosis" },
  { writer: "Sylvia Plath", book: "The Bell Jar" },
  { writer: "Langston Hughes", book: "The Weary Blues" },
  { writer: "Chinua Achebe", book: "Things Fall Apart" },
  { writer: "Margaret Atwood", book: "The Handmaid's Tale" },
  { writer: "Jorge Luis Borges", book: "Ficciones" },
  { writer: "Italo Calvino", book: "Invisible Cities" },
  { writer: "Albert Camus", book: "The Stranger" },
  { writer: "Anton Chekhov", book: "The Cherry Orchard" },
  { writer: "Dante Alighieri", book: "The Divine Comedy" },
  { writer: "Charles Baudelaire", book: "Les Fleurs du mal" },
  { writer: "Geoffrey Chaucer", book: "The Canterbury Tales" },
  { writer: "Ernest Hemingway", book: "The Old Man and the Sea" },
  { writer: "Kazuo Ishiguro", book: "Never Let Me Go" },
  { writer: "John Keats", book: "Ode to a Nightingale" },
  { writer: "Jack Kerouac", book: "On the Road" },
  { writer: "Milan Kundera", book: "The Unbearable Lightness of Being" },
  { writer: "Gustave Flaubert", book: "Madame Bovary" },
  { writer: "Herman Melville", book: "Moby Dick" },
  { writer: "Vladimir Nabokov", book: "Lolita" },
  { writer: "George Eliot", book: "Middlemarch" },
  { writer: "Oscar Wilde", book: "The Picture of Dorian Gray" },
  { writer: "Lu Xun", book: "Diary of a Madman" },
  { writer: "Yasunari Kawabata", book: "Snow Country" },
  { writer: "Salman Rushdie", book: "Midnight's Children" },
  { writer: "Zora Neale Hurston", book: "Their Eyes Were Watching God" },
  { writer: "Aldous Huxley", book: "Brave New World" },
  { writer: "Marcel Proust", book: "In Search of Lost Time" },
  { writer: "Orhan Pamuk", book: "My Name Is Red" },
  { writer: "Rabindranath Tagore", book: "Gitanjali" },
  { writer: "Virginia Woolf", book: "Mrs Dalloway" },
  { writer: "Henrik Ibsen", book: "A Doll's House" },
  { writer: "Sappho", book: "If Not, Winter: Fragments of Sappho" },
  { writer: "Miguel de Cervantes", book: "Don Quixote" },
  { writer: "Jean-Paul Sartre", book: "Nausea" },
  { writer: "Simone de Beauvoir", book: "The Second Sex" },
  { writer: "Jonathan Swift", book: "Gulliver's Travels" },
  { writer: "Daphne du Maurier", book: "Rebecca" },
  { writer: "Leo Tolstoy", book: "Anna Karenina" },
  { writer: "John Steinbeck", book: "The Grapes of Wrath" },
  { writer: "Nikolai Gogol", book: "Dead Souls" },
  { writer: "Arthur Conan Doyle", book: "The Adventures of Sherlock Holmes" },
  { writer: "Agatha Christie", book: "Murder on the Orient Express" },
  { writer: "Ray Bradbury", book: "Fahrenheit 451" },
  { writer: "Philip K. Dick", book: "Do Androids Dream of Electric Sheep?" },
  { writer: "J.D. Salinger", book: "The Catcher in the Rye" },
  {
    writer: "H.P. Lovecraft",
    book: "The Call of Cthulhu and Other Weird Stories",
  },
  { writer: "Isabel Allende", book: "The House of the Spirits" },
  { writer: "Alice Walker", book: "The Color Purple" },
  { writer: "Kurt Vonnegut", book: "Slaughterhouse-Five" },
  { writer: "Harper Lee", book: "To Kill a Mockingbird" },
  { writer: "Alexandre Dumas", book: "The Count of Monte Cristo" },
  { writer: "Victor Hugo", book: "Les Misérables" },
  { writer: "Johann Wolfgang von Goethe", book: "Faust" },
  { writer: "Thomas Mann", book: "Buddenbrooks" },
  { writer: "Herman Hesse", book: "Steppenwolf" },
  { writer: "Françoise Sagan", book: "Bonjour Tristesse" },
  { writer: "Italo Svevo", book: "Zeno's Conscience" },
  { writer: "Gabriela Mistral", book: "Desolation" },
  { writer: "Octavio Paz", book: "The Labyrinth of Solitude" },
  { writer: "E.M. Forster", book: "A Passage to India" },
  { writer: "Ian McEwan", book: "Atonement" },
  { writer: "David Foster Wallace", book: "Infinite Jest" },
  { writer: "Don DeLillo", book: "White Noise" },
  { writer: "Yukio Mishima", book: "The Temple of the Golden Pavilion" },
  { writer: "Clarice Lispector", book: "The Hour of the Star" },
  { writer: "Chimamanda Ngozi Adichie", book: "Half of a Yellow Sun" },
  { writer: "J.K. Rowling", book: "Harry Potter and the Philosopher's Stone" },
  { writer: "Ken Kesey", book: "One Flew Over the Cuckoo's Nest" },
  { writer: "Marguerite Yourcenar", book: "Memoirs of Hadrian" },
  { writer: "Paulo Coelho", book: "The Alchemist" },
  { writer: "Khaled Hosseini", book: "The Kite Runner" },
  { writer: "Elena Ferrante", book: "My Brilliant Friend" },
  { writer: "Kazuo Ishiguro", book: "The Remains of the Day" },
  { writer: "Amos Oz", book: "A Tale of Love and Darkness" },
  { writer: "Banana Yoshimoto", book: "Kitchen" },
  { writer: "Jose Saramago", book: "Blindness" },
  { writer: "Alice Munro", book: "Dear Life" },
  { writer: "Annie Proulx", book: "Brokeback Mountain" },
  { writer: "Erich Maria Remarque", book: "All Quiet on the Western Front" },
  { writer: "Günter Grass", book: "The Tin Drum" },
  { writer: "Haruki Murakami", book: "The Wind-Up Bird Chronicle" },
  { writer: "Ian Fleming", book: "Casino Royale" },
  { writer: "James Baldwin", book: "Giovanni's Room" },
  { writer: "Jean Rhys", book: "Wide Sargasso Sea" },
  { writer: "John Updike", book: "Rabbit, Run" },
  { writer: "José Rizal", book: "Noli Me Tangere" },
  { writer: "Louisa May Alcott", book: "Little Women" },
  { writer: "Naguib Mahfouz", book: "Palace Walk" },
  { writer: "Natsume Sōseki", book: "Kokoro" },
  { writer: "Neil Gaiman", book: "American Gods" },
  { writer: "Patrick Süskind", book: "Perfume: The Story of a Murderer" },
  { writer: "Philip Roth", book: "American Pastoral" },
  { writer: "Primo Levi", book: "If This Is a Man" },
  { writer: "R.K. Narayan", book: "The Guide" },
  { writer: "Richard Wright", book: "Native Son" },
  { writer: "Roald Dahl", book: "Charlie and the Chocolate Factory" },
  { writer: "Roberto Bolaño", book: "2666" },
  { writer: "Salman Rushdie", book: "The Satanic Verses" },
  { writer: "Samuel Beckett", book: "Waiting for Godot" },
  { writer: "Saul Bellow", book: "Herzog" },
  {
    writer: "Sherman Alexie",
    book: "The Absolutely True Diary of a Part-Time Indian",
  },
  { writer: "Stieg Larsson", book: "The Girl with the Dragon Tattoo" },
  { writer: "Sue Monk Kidd", book: "The Secret Life of Bees" },
  { writer: "Umberto Eco", book: "The Name of the Rose" },
  { writer: "V.S. Naipaul", book: "A House for Mr Biswas" },
  { writer: "Virginia Woolf", book: "A Room of One's Own" },
  { writer: "W. Somerset Maugham", book: "Of Human Bondage" },
  { writer: "Walt Whitman", book: "Leaves of Grass" },
  { writer: "Willa Cather", book: "My Ántonia" },
  { writer: "William Faulkner", book: "The Sound and the Fury" },
  { writer: "Yasunari Kawabata", book: "The Master of Go" },
  { writer: "Yevgeny Zamyatin", book: "We" },
  { writer: "Yukio Mishima", book: "Patriotism" },
  { writer: "Zadie Smith", book: "White Teeth" },
  {
    writer: "Aleksandr Solzhenitsyn",
    book: "One Day in the Life of Ivan Denisovich",
  },
  { writer: "Antoine de Saint-Exupéry", book: "The Little Prince" },
  { writer: "Arthur Miller", book: "Death of a Salesman" },
  { writer: "Audre Lorde", book: "Sister Outsider" },
  { writer: "Ayn Rand", book: "Atlas Shrugged" },
  { writer: "Bertolt Brecht", book: "Mother Courage and Her Children" },
  { writer: "Carson McCullers", book: "The Heart Is a Lonely Hunter" },
  { writer: "Cesare Pavese", book: "The Moon and the Bonfires" },
  { writer: "Chinua Achebe", book: "Arrow of God" },
  { writer: "Cormac McCarthy", book: "Blood Meridian" },
  { writer: "D.H. Lawrence", book: "Sons and Lovers" },
  { writer: "Donna Tartt", book: "The Secret History" },
  { writer: "Doris Lessing", book: "The Golden Notebook" },
  { writer: "Douglas Adams", book: "The Hitchhiker's Guide to the Galaxy" },
  { writer: "E.L. James", book: "Fifty Shades of Grey" },
  { writer: "Eduardo Galeano", book: "Open Veins of Latin America" },
  { writer: "Elias Canetti", book: "Auto-da-Fé" },
  { writer: "Elie Wiesel", book: "Night" },
  { writer: "Elizabeth Gilbert", book: "Eat, Pray, Love" },
  { writer: "Ellen Hopkins", book: "Crank" },
  { writer: "Emily Brontë", book: "Wuthering Heights" },
  { writer: "Erich Fromm", book: "The Art of Loving" },
  { writer: "Eudora Welty", book: "The Optimist's Daughter" },
  { writer: "F. Scott Fitzgerald", book: "The Great Gatsby" },
  { writer: "Fernando Pessoa", book: "The Book of Disquiet" },
  { writer: "Flannery O'Connor", book: "A Good Man Is Hard to Find" },
  { writer: "Ford Madox Ford", book: "The Good Soldier" },
  { writer: "Franz Kafka", book: "The Trial" },
  { writer: "Graham Greene", book: "The Power and the Glory" },
  { writer: "Gustavo Adolfo Bécquer", book: "Rhymes and Legends" },
  { writer: "H.G. Wells", book: "The War of the Worlds" },
  { writer: "Harper Lee", book: "Go Set a Watchman" },
  { writer: "Henri Barbusse", book: "Under Fire" },
  { writer: "Henry James", book: "The Portrait of a Lady" },
  { writer: "Hilary Mantel", book: "Wolf Hall" },
  { writer: "Iris Murdoch", book: "The Sea, The Sea" },
  { writer: "Isaac Asimov", book: "Foundation" },
  { writer: "J.M. Coetzee", book: "Disgrace" },
  { writer: "Jack London", book: "The Call of the Wild" },
  { writer: "Jean Genet", book: "Our Lady of the Flowers" },
  { writer: "Jeffrey Eugenides", book: "Middlesex" },
  { writer: "Jhumpa Lahiri", book: "The Namesake" },
  { writer: "Joan Didion", book: "The Year of Magical Thinking" },
  { writer: "John Fowles", book: "The Magus" },
  { writer: "John Green", book: "The Fault in Our Stars" },
  { writer: "John le Carré", book: "The Spy Who Came in from the Cold" },
  { writer: "Jonathan Franzen", book: "The Corrections" },
  { writer: "Josef Škvorecký", book: "The Engineer of Human Souls" },
  { writer: "Joseph Conrad", book: "Heart of Darkness" },
  { writer: "Julio Cortázar", book: "Hopscotch" },
  { writer: "Karl Ove Knausgård", book: "My Struggle" },
  { writer: "Kate Chopin", book: "The Awakening" },
  { writer: "Kenzaburō Ōe", book: "A Personal Matter" },
  { writer: "Kobo Abe", book: "The Woman in the Dunes" },
  { writer: "L.N. Tolstoy", book: "The Death of Ivan Ilyich" },
  { writer: "Langston Hughes", book: "Montage of a Dream Deferred" },
  { writer: "Laura Esquivel", book: "Like Water for Chocolate" },
  { writer: "Laurence Sterne", book: "Tristram Shandy" },
  { writer: "Leo Tolstoy", book: "The Kreutzer Sonata" },
  { writer: "Leonora Carrington", book: "The Hearing Trumpet" },
];

const psychedelicPainters = [
  "Alex Grey",
  "Rick Griffin",
  "Victor Moscoso",
  "Stanley Mouse",
  "Wes Wilson",
  "Matthias Grünewald",
  "Hieronymus Bosch",
  "Salvador Dalí",
  "Roberto Matta",
  "Peter Max",
  "Roger Dean",
  "H.R. Giger",
  "Robert Crumb",
  "Bridget Riley",
  "Friedensreich Hundertwasser",
  "Ernst Fuchs",
  "Pablo Picasso",
];

let deities = [
  "Zeus",
  "Hera",
  "Poseidon",
  "Demeter",
  "Ares",
  "Athena",
  "Apollo",
  "Artemis",
  "Hephaestus",
  "Aphrodite",
  "Hermes",
  "Dionysus",
  "Hades",
  "Hestia",
  "Persephone",
  "Hypnos",
  "Nike",
  "Janus",
  "Nemesis",
  "Iris",
  "Hecate",
  "Tyche",
  "Eros",
  "Achlys",
  "Deimos",
  "Phobos",
  "Adonis",
  "Pan",
  "Asclepius",
  "Circe",
  "Heracles",
  "Helen of Troy",
  "Pandora",
  "Medusa",
  "Atlas",
  "Gaia",
  "Cronus",
  "Prometheus",
  "Mnemosyne",
  "Hyperion",
  "Theia",
  "Metis",
  "Amphitrite",
  "Rhea",
  "Tethys",
  "Themis",
  "Aegaeon",
  "Eileithyia",
  "Enyo",
  "Eris",
  "Hebe",
  "Helios",
  "Selene",
  "Eos",
  "Aeolus",
  "Boreas",
  "Zephyrus",
  "Notus",
  "Eurus",
  "Apate",
  "Dolos",
  "Morpheus",
  "Epimetheus",
  "Europa",
  "Ganymede",
  "Kore",
  "Melinoe",
  "Perseus",
  "Lakshmi",
  "Shiva",
  "Durga",
  "Vishnu",
  "Kali",
  "Brahma",
  "Saraswati",
  "Krishna",
  "Rama",
  "Hanuman",
  "Ganesha",
  "Indra",
  "Surya",
  "Agni",
  "Varuna",
  "Vayu",
  "Kubera",
  "Yama",
  "Nirrti",
  "Ishvara",
  "Prakriti",
  "Radha",
  "Rati",
  "Rudra",
  "Skanda",
  "Ayyappan",
  "Sita",
  "Parvati",
  "Narada",
  "Odin",
  "Thor",
  "Freyja",
  "Heimdallr",
  "Tyr",
  "Baldur",
  "Freyr",
  "Loki",
  "Njord",
  "Frigg",
  "Sif",
  "Idun",
  "Ran",
  "Bragi",
  "Skadi",
  "Forseti",
  "Norns",
  "Ullr",
  "Valkyries",
  "Gefjon",
  "Aegir",
  "Hel",
  "Jormungand",
  "Fenrir",
  "Sleipnir",
  "Nehalennia",
  "Ra",
  "Anubis",
  "Isis",
  "Osiris",
  "Horus",
  "Thoth",
  "Hathor",
  "Set",
  "Sekhmet",
  "Nut",
  "Geb",
  "Bastet",
  "Maat",
  "Amun",
  "Anhur",
  "Atum",
  "Bes",
  "Heket",
  "Khnum",
  "Khonsu",
  "Kuk",
  "Nekhbet",
  "Ptah",
  "Sopdu",
  "Taweret",
  "Tefnut",
  "Amaterasu",
  "Izanagi",
  "Izanami",
  "Susanoo",
  "Tsukuyomi",
  "Raijin",
  "Fujin",
  "Inari",
  "Hachiman",
  "Bishamon",
  "Daikokuten",
  "Ebisu",
  "Fukurokuju",
  "Jurojin",
  "Omoikane",
  "Ryujin",
  "Suijin",
  "Uzume",
  "Yama-no-Kami",
  "Yan-gant-y-tan",
  "Quetzalcoatl",
  "Tezcatlipoca",
  "Tlaloc",
  "Huitzilopochtli",
  "Xipe Totec",
  "Xochiquetzal",
  "Tonatiuh",
  "Coyolxauhqui",
  "Ehecatl",
  "Metztli",
  "Mictlantecuhtli",
  "Chalchiuhtlicue",
  "Centzon Totochtin",
  "Tlaltecuhtli",
  "Chantico",
  "Xolotl",
  "Mixcoatl",
  "Cihuacoatl",
  "Xochipilli",
  "Coatlicue",
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createFirstAnkysIteration = async () => {
  let i = 1;
  try {
    for (const world of worlds) {
      for (const city of world.cities) {
        for (const number of [1, 2, 3, 3, 4, 5, 6, 7]) {
          // Introduce a delay here, e.g., 1000 milliseconds (1 second)
          await delay(333);

          const psychedelicPainterIndex = Math.floor(
            Math.random() * psychedelicPainters.length
          );
          const psychedelicPainter =
            psychedelicPainters[psychedelicPainterIndex];

          const randomDeityIndex = Math.floor(Math.random() * deities.length);
          const randomDeity = deities[randomDeityIndex];

          if (i <= fascinatingWriters.length) {
            const newAnky = await prisma.ankyWriter.create({
              data: {
                writer: fascinatingWriters[i - 1].writer,
                book: fascinatingWriters[i - 1].book,
                kingdom: world.name,
                chakra: world.chakra,
                deity: randomDeity,
                painter: psychedelicPainter,
                city: city.cityName.toLowerCase(),
                index: i,
              },
            });
            console.log(`the anky writer #${i} was added to the database`);
            i++;
          } else {
            console.log("No more fascinating writers to process.");
            break; // Exit if we have processed all fascinating writers
          }
        }
      }
    }
  } catch (error) {
    console.log("there was an error here", error);
  }
};

const openai = new OpenAI();

const generateAllAnkyImages = async () => {
  try {
    const allAnkyWriters = await prisma.ankyWriter.findMany({
      where: { name: null },
    });
    for (const ankyWriter of allAnkyWriters) {
      delay(3333);
      console.log(
        `right before doing this with anky writer index number ${ankyWriter.index}`
      );
      await generateAnkyWriterStory(ankyWriter);
    }
  } catch (error) {
    console.log("there was an eeeeeerror", error);
  }
};

const createImageAgain = async (anky) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${process.env.IMAGINE_API_TOKEN}` },
    };
    const responseFromImagineApi = await axios.post(
      `http://${process.env.MIDJOURNEY_SERVER_IP}:8055/items/images`,
      {
        prompt: anky.imagePrompt,
      },
      config
    );
    await prisma.ankyWriter.update({
      where: { id: anky.id },
      data: {
        imagineApiStatus: "pending",
        imagineApiID: responseFromImagineApi.data.data.id,
      },
    });
    console.log("the anky was sent back to creating image");
  } catch (error) {
    console.log("there was an error creating the image again,", error);
  }
};

const checkAndUpdateGeneratedAnkyWriters = async () => {
  const ankys = await prisma.ankyWriter.findMany({
    where: { imageOneUrl: null },
  });
  console.log("there are x ankys", ankys.length);
  for (const anky of ankys) {
    try {
      await delay(555);
      let response, thisCastCreationResponse, apiData;

      if (anky.imagineApiStatus != "completed") {
        response = await axios.get(
          `http://${process.env.MIDJOURNEY_SERVER_IP}:8055/items/images/${anky.imagineApiID}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.IMAGINE_API_TOKEN}`,
            },
          }
        );
        apiData = response.data.data;
      }

      if (
        apiData?.status === "completed" ||
        anky.imagineApiStatus === "completed"
      ) {
        if (apiData) {
          console.log("this anky will be updated");
          const upscaledIds = apiData.upscaled;
          const imageUrls = [];
          for (const imageId of upscaledIds) {
            const thisImageUrl = `http://${process.env.MIDJOURNEY_SERVER_IP}:8055/assets/${imageId}/${imageId}.png`;

            imageUrls.push(thisImageUrl);
          }
          await prisma.ankyWriter.update({
            where: { id: anky.id },
            data: {
              imageOneUrl: imageUrls[0],
              imageTwoUrl: imageUrls[1],
              imageThreeUrl: imageUrls[2],
              imageFourUrl: imageUrls[3],
              imagineApiStatus: "completed",
            },
          });
        }
      } else if (apiData.status === "failed") {
        console.log(
          "the image will be generated again because it failed before"
        );
        createImageAgain(anky);
      } else {
        await prisma.ankyWriter.update({
          where: { id: anky.id },
          data: { imagineApiStatus: apiData.status },
        });
      }
    } catch (error) {
      console.error(
        `Error updating GeneratedAnky with cid ${anky.cid}: `,
        error?.response?.data?.errors || error
      );
    }
  }
};

async function generateAnkyWriterStory(ankyWriter) {
  try {
    console.log(
      `inside the generate anky writer story for anky writer #${ankyWriter.index}`
    );
    const messages = [
      {
        role: "system",
        content: `You are in charge of imagining a character of a cartoon world. This character is created as a consequence of a human writer, and a book that that writer created. In this case, it is ${ankyWriter.writer}, and the book ${ankyWriter.book}.
        
        Your mission is to distill the essence of that writer's work so that you can come up with:
            
            A name for this character. Inspired by the name of the writer, and ${ankyWriter.deity}, which is an ancient human deity. Also use the story of this deity to craft the story of this character inside the ankyverse.

            An image prompt, the goal is to create a piece of art that represents this writer, so make this a graphical description of a circumstance that the character is going through. Derive inspiration from the book and the writer's story (and also the deity). Make it as descriptive as possible, on one paragraph.
    
            A story. Please use everything as an inspiration to carve the story of this character inside the ankyverse.
    
            {
                "name": "A name inspired by the one of this character's favorite author, the main character of the book that this character loves from that author, and ${ankyWriter.deity}, which is the deity that serves as the inspiration for it.",
                "imagePrompt": "A graphical description of this character, as if it was a painting made by ${ankyWriter.painter}. Don't use references to the writer or the deity or anything associated with a name, just describe the image.",
                "story": "A short story of this character inside the ankyverse, related to the characters favorite book. The city where this character is located is called ${ankyWriter.city}, on the kingdom of ${ankyWriter.kingdom}, which is associated with the energy of the ${ankyWriter.chakra} chakra. This story needs to inspire the user that reads it. This character will be the companion of a human writer, so make the story inspiring for this human writer.",
            }
        
            The JSON object, correctly formatted is: `,
      },
      {
        role: "user",
        content:
          "create something amazing that inspires awe to the human that will read it.",
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: messages,
    });

    const dataResponse = completion.choices[0].message.content;

    const nameRegex = /"name"\s*:\s*"([\s\S]*?)"/;
    const imagePromptRegex = /"imagePrompt"\s*:\s*"([\s\S]*?)"/;
    const storyRegex = /"story"\s*:\s*"([\s\S]*?)"/;

    const nameMatch = dataResponse.match(nameRegex);
    const imagePromptMatch = dataResponse.match(imagePromptRegex);
    const storyMatch = dataResponse.match(storyRegex);

    let name, imagePrompt, story;

    if (nameMatch !== null && nameMatch.length > 1) {
      name = nameMatch[1];
    }

    if (imagePromptMatch !== null && imagePromptMatch.length > 1) {
      imagePrompt = imagePromptMatch[1];
    }

    if (storyMatch !== null && storyMatch.length > 1) {
      story = storyMatch[1];
    }

    const config = {
      headers: { Authorization: `Bearer ${process.env.IMAGINE_API_TOKEN}` },
    };

    let imagineApiID, newImagePrompt;
    if (name && imagePrompt && story) {
      newImagePrompt = `https://s.mj.run/YLJMlMJbo70, ${imagePrompt}, ${ankyWriter.painter} style, --ar 10:16`;
      const responseFromImagineApi = await axios.post(
        `http://${process.env.MIDJOURNEY_SERVER_IP}:8055/items/images`,
        {
          prompt: newImagePrompt,
        },
        config
      );
      imagineApiID = responseFromImagineApi.data.data.id;
      await prisma.ankyWriter.update({
        where: { id: ankyWriter.id },
        data: {
          name: name,
          imagePrompt: newImagePrompt,
          story: story,
          imagineApiID: imagineApiID,
          imagineApiStatus: "pending",
        },
      });
      console.log(
        "the anky was sent for geneartion",
        ankyWriter.index,
        newImagePrompt,
        story,
        name
      );
    } else {
      console.log("there was a problem");
    }
  } catch (error) {
    console.log("there was an error here", error);
  }
}

const createAnkyImage = async ({ ankyWriter }) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${process.env.IMAGINE_API_TOKEN}` },
    };
    const responseFromImagineApi = await axios.post(
      `http://${process.env.MIDJOURNEY_SERVER_IP}:8055/items/images`,
      {
        prompt: ankyWriter.imagePrompt,
      },
      config
    );
    await prisma.ankyWriter.update({
      where: { id: ankyWriter.id },
      data: {
        imagineApiStatus: "pending",
        imagineApiID: responseFromImagineApi.data.data.id,
      },
    });
  } catch (error) {}
};

// createFirstAnkysIteration();
// generateAllAnkyImages();
checkAndUpdateGeneratedAnkyWriters();

module.exports = {};
