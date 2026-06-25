import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';
import bugTypeIcon from '../pokedex/types/bug.png';
import darkTypeIcon from '../pokedex/types/dark.png';
import dragonTypeIcon from '../pokedex/types/dragon.png';
import electricTypeIcon from '../pokedex/types/electric.png';
import fairyTypeIcon from '../pokedex/types/fairy.png';
import fightingTypeIcon from '../pokedex/types/fighting.png';
import fireTypeIcon from '../pokedex/types/fire.png';
import flyingTypeIcon from '../pokedex/types/flying.png';
import ghostTypeIcon from '../pokedex/types/ghost.png';
import grassTypeIcon from '../pokedex/types/grass.png';
import groundTypeIcon from '../pokedex/types/ground.png';
import iceTypeIcon from '../pokedex/types/ice.png';
import normalTypeIcon from '../pokedex/types/normal.png';
import poisonTypeIcon from '../pokedex/types/poison.png';
import psychicTypeIcon from '../pokedex/types/psychic.png';
import rockTypeIcon from '../pokedex/types/rock.png';
import steelTypeIcon from '../pokedex/types/steel.png';
import waterTypeIcon from '../pokedex/types/water.png';
import physicalMoveIcon from '../pokedex/moves/move-physical.png';
import specialMoveIcon from '../pokedex/moves/move-special.png';
import statusMoveIcon from '../pokedex/moves/move-status.png';
import alphaSapphireGameArt from '../pokedex/games/AlphaSapphire.png';
import blackGameArt from '../pokedex/games/Black.png';
import diamondGameArt from '../pokedex/games/Diamond.jpg';
import emeraldGameArt from '../pokedex/games/Emerald.jpg';
import fireRedGameArt from '../pokedex/games/FireRed.png';
import heartGoldGameArt from '../pokedex/games/HeartGold.jpg';
import leafGreenGameArt from '../pokedex/games/LeafGreen.png';
import moonGameArt from '../pokedex/games/Moon.png';
import omegaRubyGameArt from '../pokedex/games/OmegaRuby.png';
import pearlGameArt from '../pokedex/games/Pearl.jpg';
import platinumGameArt from '../pokedex/games/Platinum.png';
import rubyGameArt from '../pokedex/games/Ruby.png';
import sapphireGameArt from '../pokedex/games/Sapphire.png';
import scarletGameArt from '../pokedex/games/Scarlet.png';
import shieldGameArt from '../pokedex/games/Shield.png';
import soulSilverGameArt from '../pokedex/games/SoulSilver.jpg';
import sunGameArt from '../pokedex/games/Sun.png';
import swordGameArt from '../pokedex/games/Sword.png';
import violetGameArt from '../pokedex/games/Violet.png';
import whiteGameArt from '../pokedex/games/White.png';
import xGameArt from '../pokedex/games/X.png';
import yGameArt from '../pokedex/games/Y.png';
import platform3ds from '../pokedex/platform/3DS.png';
import platformDs from '../pokedex/platform/DS.png';
import platformGameBoyAdvance from '../pokedex/platform/GameBoyAdvance.png';
import platformSwitch from '../pokedex/platform/Switch.png';
import speakerIcon from '../pokedex/misc/Speaker_Icon.svg';
import unownQuestionMark from '../pokedex/misc/Unown_QuestionMark.png';
import whosThatPokemonBg from '../pokedex/misc/WhosThatPokemon.png';

const COLLECTION_STORAGE_KEY = 'pokemon-pack-simulator-collection';
const WHO_LEADERBOARD_STORAGE_KEY = 'whos-that-pokemon-leaderboard';
const CARD_FLIP_DELAY = 200;
const PACK_PREP_DELAY = 900;
const TEN_PACK_FLIP_DELAY = CARD_FLIP_DELAY / 10;
const CARD_BACK_IMAGE = 'https://images.pokemontcg.io/unbroken-bond/back.png';
const REPOSITORY_URL = 'https://github.com/TeohHW/Pokemon-TCG-Simulator-React';
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const POKEDEX_OPTIONS = [
  {
    id: 'kanto',
    label: 'FireRed / LeafGreen',
    region: 'Kanto',
    art: [fireRedGameArt, leafGreenGameArt],
    releaseDate: '2004',
    director: 'Junichi Masuda',
    platforms: [{ name: 'Game Boy Advance', icon: platformGameBoyAdvance }],
    starters: [1, 4, 7],
  },
  {
    id: 'hoenn',
    label: 'Ruby / Sapphire / Emerald',
    region: 'Hoenn',
    art: [rubyGameArt, sapphireGameArt, emeraldGameArt],
    releaseDate: '2002-2004',
    director: 'Junichi Masuda / Shigeki Morimoto',
    platforms: [{ name: 'Game Boy Advance', icon: platformGameBoyAdvance }],
    starters: [252, 255, 258],
  },
  {
    id: 'updated-johto',
    label: 'HeartGold / SoulSilver',
    region: 'Johto',
    art: [heartGoldGameArt, soulSilverGameArt],
    releaseDate: '2009',
    director: 'Shigeki Morimoto',
    platforms: [{ name: 'Nintendo DS', icon: platformDs }],
    starters: [152, 155, 158],
  },
  {
    id: 'extended-sinnoh',
    label: 'Diamond / Pearl / Platinum',
    region: 'Sinnoh',
    art: [diamondGameArt, pearlGameArt, platinumGameArt],
    releaseDate: '2006-2008',
    director: 'Junichi Masuda / Takeshi Kawachimaru',
    platforms: [{ name: 'Nintendo DS', icon: platformDs }],
    starters: [387, 390, 393],
  },
  {
    id: 'updated-unova',
    label: 'Black 2 / White 2',
    region: 'Unova',
    art: [blackGameArt, whiteGameArt],
    releaseDate: '2012',
    director: 'Takao Unno',
    platforms: [{ name: 'Nintendo DS', icon: platformDs }],
    starters: [495, 498, 501],
  },
  {
    id: 'kalos-central',
    label: 'X / Y',
    region: 'Kalos',
    art: [xGameArt, yGameArt],
    releaseDate: '2013',
    director: 'Junichi Masuda',
    platforms: [{ name: 'Nintendo 3DS', icon: platform3ds }],
    starters: [650, 653, 656],
  },
  {
    id: 'updated-hoenn',
    label: 'Omega Ruby / Alpha Sapphire',
    region: 'Hoenn',
    art: [omegaRubyGameArt, alphaSapphireGameArt],
    releaseDate: '2014',
    director: 'Shigeru Ohmori',
    platforms: [{ name: 'Nintendo 3DS', icon: platform3ds }],
    starters: [252, 255, 258],
  },
  {
    id: 'original-alola',
    label: 'Sun / Moon',
    region: 'Alola',
    art: [sunGameArt, moonGameArt],
    releaseDate: '2016',
    director: 'Shigeru Ohmori',
    platforms: [{ name: 'Nintendo 3DS', icon: platform3ds }],
    starters: [722, 725, 728],
  },
  {
    id: 'galar',
    label: 'Sword / Shield',
    region: 'Galar',
    art: [swordGameArt, shieldGameArt],
    releaseDate: '2019',
    director: 'Shigeru Ohmori',
    platforms: [{ name: 'Nintendo Switch', icon: platformSwitch }],
    starters: [810, 813, 816],
  },
  {
    id: 'paldea',
    label: 'Scarlet / Violet',
    region: 'Paldea',
    art: [scarletGameArt, violetGameArt],
    releaseDate: '2022',
    director: 'Shigeru Ohmori',
    platforms: [{ name: 'Nintendo Switch', icon: platformSwitch }],
    starters: [906, 909, 912],
  },
];
const ALL_POKEDEX_OPTION = {
  id: 'all',
  label: 'All Games',
  region: 'Every listed Pokedex',
  art: [],
  releaseDate: '1996-present',
  platforms: [
    { name: 'Game Boy Advance', icon: platformGameBoyAdvance },
    { name: 'Nintendo DS', icon: platformDs },
    { name: 'Nintendo 3DS', icon: platform3ds },
    { name: 'Nintendo Switch', icon: platformSwitch },
  ],
};
const TYPE_ICONS = {
  bug: bugTypeIcon,
  dark: darkTypeIcon,
  dragon: dragonTypeIcon,
  electric: electricTypeIcon,
  fairy: fairyTypeIcon,
  fighting: fightingTypeIcon,
  fire: fireTypeIcon,
  flying: flyingTypeIcon,
  ghost: ghostTypeIcon,
  grass: grassTypeIcon,
  ground: groundTypeIcon,
  ice: iceTypeIcon,
  normal: normalTypeIcon,
  poison: poisonTypeIcon,
  psychic: psychicTypeIcon,
  rock: rockTypeIcon,
  steel: steelTypeIcon,
  water: waterTypeIcon,
};
const MOVE_CATEGORY_ICONS = {
  physical: physicalMoveIcon,
  special: specialMoveIcon,
  status: statusMoveIcon,
};
const LATEST_VERSION_GROUPS = [
  'scarlet-violet',
  'sword-shield',
  'sun-moon',
  'omega-ruby-alpha-sapphire',
  'x-y',
  'black-2-white-2',
  'black-white',
  'heartgold-soulsilver',
  'platinum',
  'diamond-pearl',
  'emerald',
  'firered-leafgreen',
  'ruby-sapphire',
];
const STAT_LABELS = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

const formatPokemonName = (name = '') =>
  name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const normalizePokemonName = (name = '') =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const getPokemonIdFromUrl = (url = '') => {
  const [, id] = url.match(/\/pokemon-species\/(\d+)\//) || [];
  return id || '';
};

const getPokemonSpriteUrl = (pokemonId) =>
  pokemonId ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png` : '';

const getPokemonOfficialArtworkUrl = (pokemonId) =>
  pokemonId
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
    : '';

const normalizePokemonLookup = (pokemonName = '') =>
  String(pokemonName)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const fetchPokemonByNameOrSpecies = (pokemonName, options = {}) => {
  const normalizedName = normalizePokemonLookup(pokemonName);
  if (!normalizedName) {
    return Promise.reject(new Error('Pokemon not found. Try a name or National Dex number.'));
  }

  return fetch(`${POKEAPI_BASE_URL}/pokemon/${normalizedName}`, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      return fetch(`${POKEAPI_BASE_URL}/pokemon-species/${normalizedName}`, options)
        .then((speciesResponse) => {
          if (!speciesResponse.ok) {
            throw new Error('Pokemon not found. Try a name or National Dex number.');
          }
          return speciesResponse.json();
        })
        .then((species) => {
          const defaultVariety =
            species.varieties?.find((variety) => variety.is_default) ||
            species.varieties?.[0];

          if (!defaultVariety?.pokemon?.url) {
            throw new Error('Pokemon species found, but no default form is available.');
          }

          return fetch(defaultVariety.pokemon.url, options).then((pokemonResponse) => {
            if (!pokemonResponse.ok) {
              throw new Error('Pokemon form could not be loaded.');
            }
            return pokemonResponse.json();
          });
        });
    });
};

const getPokemonIdFromSpeciesUrl = (url = '') => {
  const [, id] = url.match(/\/pokemon-species\/(\d+)\//) || [];
  return id || '';
};

const getPokemonIdFromPokemonUrl = (url = '') => {
  const [, id] = url.match(/\/pokemon\/(\d+)\//) || [];
  return id || '';
};

const getEnglishFlavorText = (species) => {
  const entry = species?.flavor_text_entries
    ?.filter((flavorEntry) => flavorEntry.language.name === 'en')
    .at(-1);

  return entry?.flavor_text?.replace(/[\f\n\r]/g, ' ') || '';
};

const cleanPokeApiText = (text = '') => text.replace(/[\f\n\r]/g, ' ');

const getEnglishEntry = (entries = []) =>
  entries.filter((entry) => entry.language.name === 'en').at(-1);

const getEnglishEffectText = (entries = []) => {
  const entry = getEnglishEntry(entries);
  return cleanPokeApiText(entry?.effect || entry?.short_effect || '');
};

const getEnglishShortEffectText = (entries = []) => {
  const entry = getEnglishEntry(entries);
  return cleanPokeApiText(entry?.short_effect || entry?.effect || '');
};

const getEnglishApiFlavorText = (entries = []) => {
  const entry = getEnglishEntry(entries);
  return cleanPokeApiText(entry?.flavor_text || '');
};

const formatEvolutionRequirement = (details = []) => {
  const detail = details[0];
  if (!detail) return 'Base form';

  if (detail.min_level) return `Level ${detail.min_level}`;
  if (detail.item?.name) return `Use ${formatPokemonName(detail.item.name)}`;
  if (detail.held_item?.name) return `Hold ${formatPokemonName(detail.held_item.name)}`;
  if (detail.known_move?.name) return `Know ${formatPokemonName(detail.known_move.name)}`;
  if (detail.known_move_type?.name) return `Know ${formatPokemonName(detail.known_move_type.name)} move`;
  if (detail.min_happiness) return `Happiness ${detail.min_happiness}`;
  if (detail.min_beauty) return `Beauty ${detail.min_beauty}`;
  if (detail.min_affection) return `Affection ${detail.min_affection}`;
  if (detail.location?.name) return `At ${formatPokemonName(detail.location.name)}`;
  if (detail.trade_species?.name) return `Trade for ${formatPokemonName(detail.trade_species.name)}`;
  if (detail.trigger?.name === 'trade') return 'Trade';
  if (detail.trigger?.name) return formatPokemonName(detail.trigger.name);

  return 'Special condition';
};

const buildEvolutionTree = (chainNode, requirement = 'Base form') => {
  if (!chainNode) return null;

  return {
    id: getPokemonIdFromSpeciesUrl(chainNode.species.url),
    name: chainNode.species.name,
    requirement,
    children: chainNode.evolves_to.map((evolutionNode) =>
      buildEvolutionTree(
        evolutionNode,
        formatEvolutionRequirement(evolutionNode.evolution_details),
      ),
    ),
  };
};

const getTypeWeaknesses = (typeData) => {
  const weaknesses = new Map();

  typeData.forEach((type) => {
    type.damage_relations.double_damage_from.forEach((weakType) => {
      weaknesses.set(weakType.name, (weaknesses.get(weakType.name) || 1) * 2);
    });
    type.damage_relations.half_damage_from.forEach((resistedType) => {
      weaknesses.set(resistedType.name, (weaknesses.get(resistedType.name) || 1) * 0.5);
    });
    type.damage_relations.no_damage_from.forEach((immuneType) => {
      weaknesses.set(immuneType.name, 0);
    });
  });

  return [...weaknesses.entries()]
    .filter(([, multiplier]) => multiplier > 1)
    .map(([name, multiplier]) => ({ name, multiplier }))
    .sort((firstType, secondType) => firstType.name.localeCompare(secondType.name));
};

const buildPokedexEntries = (pokedexPayloads, useNationalNumbers = false) => {
  const uniquePokemon = new Map();

  pokedexPayloads.forEach((payload) => {
    (payload.pokemon_entries || []).forEach((entry) => {
      const pokemonId = getPokemonIdFromUrl(entry.pokemon_species.url);

      if (!uniquePokemon.has(entry.pokemon_species.name)) {
        uniquePokemon.set(entry.pokemon_species.name, {
          name: entry.pokemon_species.name,
          entryNumber: useNationalNumbers ? Number(pokemonId || entry.entry_number) : entry.entry_number,
          pokemonId,
        });
      }
    });
  });

  return [...uniquePokemon.values()].sort((firstPokemon, secondPokemon) => (
    firstPokemon.entryNumber - secondPokemon.entryNumber
  ));
};

const formatVersionGroupName = (name = '') =>
  name
    .split('-')
    .map((word) => (word === 'and' ? '&' : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ');

const formatGenerationName = (name = '') => {
  const generationNumber = {
    'generation-i': '1',
    'generation-ii': '2',
    'generation-iii': '3',
    'generation-iv': '4',
    'generation-v': '5',
    'generation-vi': '6',
    'generation-vii': '7',
    'generation-viii': '8',
    'generation-ix': '9',
  }[name];

  return generationNumber ? `Generation ${generationNumber}` : formatVersionGroupName(name);
};

const getAvailableLevelUpMoveGroups = (pokemon) => {
  if (!pokemon?.moves?.length) {
    return [];
  }

  const groupNames = new Set();

  pokemon.moves.forEach((move) => {
    move.version_group_details.forEach((detail) => {
      if (detail.move_learn_method.name === 'level-up') {
        groupNames.add(detail.version_group.name);
      }
    });
  });

  return [...groupNames].filter((groupName) => LATEST_VERSION_GROUPS.includes(groupName)).sort((firstGroup, secondGroup) => {
    const firstIndex = LATEST_VERSION_GROUPS.indexOf(firstGroup);
    const secondIndex = LATEST_VERSION_GROUPS.indexOf(secondGroup);
    return (
      (firstIndex === -1 ? Number.MAX_SAFE_INTEGER : firstIndex) -
      (secondIndex === -1 ? Number.MAX_SAFE_INTEGER : secondIndex)
    );
  });
};

const getLevelUpMovesForVersionGroup = (pokemon, versionGroup) => {
  if (!pokemon?.moves?.length || !versionGroup) {
    return [];
  }

  return pokemon.moves
    .map((move) => {
      const detail = move.version_group_details.find(
        (versionDetail) =>
          versionDetail.version_group.name === versionGroup &&
          versionDetail.move_learn_method.name === 'level-up',
      );

      return detail
        ? {
            name: move.move.name,
            url: move.move.url,
            level: detail.level_learned_at,
          }
        : null;
    })
    .filter(Boolean)
    .sort((firstMove, secondMove) => (
      firstMove.level - secondMove.level || firstMove.name.localeCompare(secondMove.name)
    ));
};

const getSpriteVariants = (sprites = {}) =>
  [
    ['Animated Front', sprites.animated?.front_default],
    ['Animated Back', sprites.animated?.back_default],
    ['Animated Front Shiny', sprites.animated?.front_shiny],
    ['Animated Back Shiny', sprites.animated?.back_shiny],
    ['Front', sprites.front_default],
    ['Back', sprites.back_default],
    ['Front Shiny', sprites.front_shiny],
    ['Back Shiny', sprites.back_shiny],
  ]
    .filter(([, image]) => Boolean(image))
    .map(([label, image]) => ({ label, image }));

const getGenerationSprites = (pokemon) => {
  const versions = pokemon?.sprites?.versions || {};

  return Object.entries(versions).flatMap(([generationName, games]) =>
    Object.entries(games).flatMap(([gameName, sprites]) => {
      if (gameName.includes('icons')) {
        return [];
      }

      const variants = getSpriteVariants(sprites);
      const preview = variants[0]?.image;

      return preview
        ? [
            {
              id: `${generationName}-${gameName}`,
              generation: formatGenerationName(generationName),
              game: formatVersionGroupName(gameName),
              image: preview,
              variants,
            },
          ]
        : [];
    }),
  );
};

const getFeaturedTcgCards = (cards, pokemonNames) => {
  const normalizedPokemonNames = [...new Set([pokemonNames].flat())]
    .map((pokemonName) => normalizePokemonName(pokemonName))
    .filter(Boolean);

  if (!normalizedPokemonNames.length) return [];

  return cards.filter((card) => {
    const normalizedCardName = normalizePokemonName(card.name);
    const cardTokens = normalizedCardName.split(' ');

    return normalizedPokemonNames.some((normalizedPokemon) => (
      normalizedCardName === normalizedPokemon ||
      normalizedCardName.includes(` ${normalizedPokemon} `) ||
      normalizedCardName.startsWith(`${normalizedPokemon} `) ||
      normalizedCardName.endsWith(` ${normalizedPokemon}`) ||
      cardTokens.includes(normalizedPokemon)
    ));
  });
};

const getCardFaceImage = (card) => card.largeImage || card.image;

const getCardFallbackImage = (card) =>
  card.largeImage && card.image !== card.largeImage ? card.image : '';

const handleCardImageError = (event) => {
  const fallbackSrc = event.currentTarget.dataset.fallbackSrc;

  if (fallbackSrc) {
    event.currentTarget.src = fallbackSrc;
    event.currentTarget.removeAttribute('data-fallback-src');
    return;
  }

  event.currentTarget.src = 'https://images.pokemontcg.io/xy12/20.png';
};

const loadCollection = () => {
  try {
    const savedCollection = localStorage.getItem(COLLECTION_STORAGE_KEY);
    return savedCollection ? JSON.parse(savedCollection) : {};
  } catch {
    return {};
  }
};

const loadWhoLeaderboard = () => {
  try {
    const savedLeaderboard = localStorage.getItem(WHO_LEADERBOARD_STORAGE_KEY);
    return savedLeaderboard ? JSON.parse(savedLeaderboard) : [];
  } catch {
    return [];
  }
};

const saveWhoLeaderboard = (entries) => {
  localStorage.setItem(WHO_LEADERBOARD_STORAGE_KEY, JSON.stringify(entries));
};

const formatLeaderboardDate = (dateValue) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateValue));

const isPokemonGuessCorrect = (guess, pokemon) => {
  const normalizedGuess = normalizePokemonLookup(guess);
  const answerNames = new Set([
    pokemon?.name,
    pokemon?.species?.name,
    formatPokemonName(pokemon?.name || ''),
    formatPokemonName(pokemon?.species?.name || ''),
  ]);

  return [...answerNames]
    .filter(Boolean)
    .some((answerName) => normalizePokemonLookup(answerName) === normalizedGuess);
};

const buildPokemonHintChoices = (pokemon, regionEntries = []) => {
  const answer = pokemon?.species?.name || pokemon?.name;
  if (!answer) return [];

  const wrongChoices = regionEntries
    .filter((entry) => normalizePokemonLookup(entry.name) !== normalizePokemonLookup(answer))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((entry) => entry.name);

  return [answer, ...wrongChoices]
    .sort(() => Math.random() - 0.5)
    .map((pokemonName) => ({
      name: pokemonName,
      label: formatPokemonName(pokemonName),
    }));
};

const buildBoosterPack = (expansion, selectedSet, packIndex = 0) => {
  const createdAt = Date.now();
  const createPackCard = (card, packId, isRare = false) => ({
    ...card,
    packId,
    flipped: false,
    isRare,
    setId: selectedSet,
    setName: expansion.setName,
  });
  const pack = [];

  for (let i = 0; i < 6; i++) {
    const card = randomItem(expansion.commons);
    pack.push(createPackCard(card, `pack-${packIndex}-c-${i}-${createdAt}`));
  }

  for (let i = 0; i < 3; i++) {
    const card = randomItem(expansion.uncommons);
    pack.push(createPackCard(card, `pack-${packIndex}-u-${i}-${createdAt}`));
  }

  const rareCard = randomItem(expansion.rares);
  pack.push(createPackCard(rareCard, `pack-${packIndex}-r-1-${createdAt}`, true));

  return pack;
};

const buildGodPack = (expansion, selectedSet) => {
  const createdAt = Date.now();
  return Array.from({ length: 10 }, (_, index) => ({
    ...randomItem(expansion.rares),
    packId: `god-${index}-${createdAt}`,
    flipped: false,
    isRare: true,
    setId: selectedSet,
    setName: expansion.setName,
  }));
};

const hasPlayableCards = (expansion) =>
  Boolean(
    expansion?.commons?.length &&
      expansion?.uncommons?.length &&
      expansion?.rares?.length,
  );

function TcgSimulator({ onBack, onOpenPokedex, onOpenWhos }) {
  const [allExpansions, setAllExpansions] = useState(null);
  const [selectedSet, setSelectedSet] = useState('base1');
  const [selectedSeries, setSelectedSeries] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [binderSearchTerm, setBinderSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState('release-oldest');
  const [currentPack, setCurrentPack] = useState([]);
  const [currentPackSet, setCurrentPackSet] = useState(null);
  const [showPackModal, setShowPackModal] = useState(false);
  const [packAdded, setPackAdded] = useState(false);
  const [isPreparingPack, setIsPreparingPack] = useState(false);
  const [isAutoRevealing, setIsAutoRevealing] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showClearBinderDialog, setShowClearBinderDialog] = useState(false);
  const [collection, setCollection] = useState(loadCollection);
  const [loading, setLoading] = useState(true);
  const revealTimersRef = useRef([]);
  const prepTimerRef = useRef(null);
  const revealDelayRef = useRef(CARD_FLIP_DELAY);

  useEffect(
    () => () => {
      clearTimeout(prepTimerRef.current);
      revealTimersRef.current.forEach((timer) => clearTimeout(timer));
    },
    [],
  );
  
  useEffect(() => {
    localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(collection));
  }, [collection]);

  useEffect(() => {
    fetch('/expansions.json')
      .then((res) => res.json())
      .then((data) => {
        setAllExpansions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading expansions.json:', err);
        setLoading(false);
      });
  }, []);

  const clearRevealTimers = () => {
    clearTimeout(prepTimerRef.current);
    prepTimerRef.current = null;
    revealTimersRef.current.forEach((timer) => clearTimeout(timer));
    revealTimersRef.current = [];
  };

  const addPackToBinder = useCallback((cards, force = false) => {
    if ((!force && packAdded) || !cards.length || !cards.every((card) => card.flipped)) {
      return;
    }

    setCollection((prevCollection) =>
      cards.reduce((nextCollection, card) => {
        const ownedCard = nextCollection[card.id];
        return {
          ...nextCollection,
          [card.id]: {
            id: card.id,
            name: card.name,
            image: card.image,
            setId: card.setId,
            setName: card.setName,
            count: (ownedCard?.count || 0) + 1,
          },
        };
      }, prevCollection),
    );
    setPackAdded(true);
  }, [packAdded]);

  const revealCards = (cards, delay = CARD_FLIP_DELAY) => {
    clearRevealTimers();
    setIsPreparingPack(true);
    setIsAutoRevealing(false);

    prepTimerRef.current = setTimeout(() => {
      setIsPreparingPack(false);
      setIsAutoRevealing(true);

      revealTimersRef.current = cards.map((card, index) =>
        setTimeout(() => {
          setCurrentPack((prevPack) => {
            const nextPack = prevPack.map((packCard) =>
              packCard.packId === card.packId ? { ...packCard, flipped: true } : packCard,
            );

            if (index === cards.length - 1) {
              setIsAutoRevealing(false);
              addPackToBinder(cards.map((packCard) => ({ ...packCard, flipped: true })), true);
            }

            return nextPack;
          });
        }, (index + 1) * delay),
      );
    }, PACK_PREP_DELAY);
  };

  const startPackReveal = (cards, revealDelay = CARD_FLIP_DELAY) => {
    clearRevealTimers();
    const annotatedCards = cards.map((card) => ({
      ...card,
      isNewPull: !collection[card.id],
    }));
    setCurrentPack(annotatedCards);
    setCurrentPackSet({
      setId: annotatedCards[0]?.setId || selectedSet,
      setName: annotatedCards[0]?.setName || allExpansions?.[selectedSet]?.setName,
      logo: allExpansions?.[annotatedCards[0]?.setId || selectedSet]?.logo,
      releaseYear: allExpansions?.[annotatedCards[0]?.setId || selectedSet]?.releaseYear,
    });
    setShowPackModal(true);
    setPackAdded(false);
    setIsPreparingPack(false);
    setIsAutoRevealing(false);
    setSelectedCard(null);
    revealDelayRef.current = revealDelay;
    revealCards(annotatedCards, revealDelay);
  };

  const openPack = () => {
    if (loading || !allExpansions) return;

    const activeSet = allExpansions[selectedSet];
    if (!hasPlayableCards(activeSet)) {
      alert('This set does not have enough cards categorized locally yet!');
      return;
    }

    startPackReveal(buildBoosterPack(activeSet, selectedSet));
  };

  const openRandomPack = () => {
    if (loading || !allExpansions) return;

    const playableSets = Object.entries(allExpansions).filter(([, expansion]) =>
      hasPlayableCards(expansion),
    );
    const [randomSetId, randomSet] = randomItem(playableSets) || [];

    if (!randomSetId || !randomSet) {
      alert('No playable sets are available locally yet!');
      return;
    }

    startPackReveal(buildBoosterPack(randomSet, randomSetId));
  };

  const openTenPacks = () => {
    if (loading || !allExpansions) return;

    const activeSet = allExpansions[selectedSet];
    if (!hasPlayableCards(activeSet)) {
      alert('This set does not have enough cards categorized locally yet!');
      return;
    }

    const packs = Array.from({ length: 10 }, (_, index) =>
      buildBoosterPack(activeSet, selectedSet, index),
    ).flat();
    startPackReveal(packs, TEN_PACK_FLIP_DELAY);
  };

  const openGodPack = () => {
    if (loading || !allExpansions) return;

    const activeSet = allExpansions[selectedSet];
    if (!activeSet?.rares?.length) {
      alert('This set does not have enough rare cards categorized locally yet!');
      return;
    }

    startPackReveal(buildGodPack(activeSet, selectedSet));
  };

  const flipCard = (packId) => {
    if (isAutoRevealing) return;

    const card = currentPack.find((packCard) => packCard.packId === packId);
    if (card?.flipped) {
      setSelectedCard(card);
      return;
    }

    const nextPack = currentPack.map((packCard) =>
      packCard.packId === packId ? { ...packCard, flipped: true } : packCard,
    );
    setCurrentPack(nextPack);
    addPackToBinder(nextPack);
  };

  const clearBinder = () => {
    setShowClearBinderDialog(true);
  };

  const confirmClearBinder = () => {
    setCollection({});
    localStorage.removeItem(COLLECTION_STORAGE_KEY);
    setShowClearBinderDialog(false);
  };

  const expansionEntries = useMemo(
    () => (allExpansions ? Object.entries(allExpansions) : []),
    [allExpansions],
  );

  const activeSet = allExpansions?.[selectedSet];
  const selectedSetIsPlayable = hasPlayableCards(activeSet);
  const activeSetCards = useMemo(() => {
    if (!activeSet) return [];

    const uniqueCards = new Map();
    [...activeSet.commons, ...activeSet.uncommons, ...activeSet.rares].forEach((card) => {
      if (!uniqueCards.has(card.id)) {
        uniqueCards.set(card.id, card);
      }
    });

    return [...uniqueCards.values()];
  }, [activeSet]);
  const ownedActiveSetCards = activeSetCards.filter((card) => collection[card.id]);
  const visibleBinderCards = useMemo(() => {
    const normalizedSearch = binderSearchTerm.trim().toLowerCase();
    if (!normalizedSearch) return activeSetCards;

    return activeSetCards.filter((card) =>
      card.name.toLowerCase().includes(normalizedSearch),
    );
  }, [activeSetCards, binderSearchTerm]);
  const binderProgress = activeSetCards.length
    ? Math.round((ownedActiveSetCards.length / activeSetCards.length) * 100)
    : 0;
  const progressLevel = binderProgress >= 75 ? 'good' : binderProgress >= 35 ? 'mid' : 'low';

  const openBinderCard = (card) => {
    setSelectedCard({
      ...card,
      setId: selectedSet,
      setName: activeSet?.setName,
      isOwnedInBinder: Boolean(collection[card.id]),
    });
  };

  const seriesOptions = useMemo(() => {
    const options = [
      'All',
      ...new Set(expansionEntries.map(([, expansion]) => expansion.series || 'Unknown')),
    ];
    return options.sort((a, b) => {
      if (a === 'All') return -1;
      if (b === 'All') return 1;
      return a.localeCompare(b);
    });
  }, [expansionEntries]);

  const visibleExpansions = useMemo(
    () =>
      expansionEntries
        .filter(([, expansion]) => hasPlayableCards(expansion))
        .filter(([, expansion]) => {
          const matchesSeries =
            selectedSeries === 'All' || expansion.series === selectedSeries;
          const matchesSearch = expansion.setName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

          return matchesSeries && matchesSearch;
        })
        .sort(([, firstExpansion], [, secondExpansion]) => {
          if (sortMode === 'name') {
            return firstExpansion.setName.localeCompare(secondExpansion.setName);
          }

          const firstDate = firstExpansion.releaseDate || '9999/99/99';
          const secondDate = secondExpansion.releaseDate || '9999/99/99';
          const dateSort = firstDate.localeCompare(secondDate);
          return sortMode === 'release-newest' ? dateSort * -1 : dateSort;
        }),
    [expansionEntries, selectedSeries, searchTerm, sortMode],
  );

  const chooseSet = (setId) => {
    clearRevealTimers();
    setSelectedSet(setId);
    setCurrentPack([]);
    setShowPackModal(false);
    setPackAdded(false);
    setIsPreparingPack(false);
    setIsAutoRevealing(false);
    setSelectedCard(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <button type="button" className="brand-mark brand-home-button" onClick={onBack}>
          <span className="nes-pokeball brand-pokeball" aria-hidden="true" />
          <h1>Pokémon TCG Simulator</h1>
        </button>
        <div className="header-actions">
          <button type="button" className="nes-btn nav-button" onClick={onBack}>
            Home
          </button>
          <button type="button" className="nes-btn nav-button" onClick={onOpenPokedex}>
            Pokedex
          </button>
          <button type="button" className="nes-btn nav-button" onClick={onOpenWhos}>
            Who's That?
          </button>
          <a
            className="repo-link"
            href={REPOSITORY_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Open GitHub repository"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 3.86c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
          </a>
        </div>
      </header>

      <div className="control-panel">
        <div className="series-filter" aria-label="Filter by series">
          {seriesOptions.map((series) => (
            <button
              key={series}
              type="button"
              className={`series-button ${selectedSeries === series ? 'is-active' : ''}`}
              onClick={() => setSelectedSeries(series)}
              disabled={loading}
            >
              {series}
            </button>
          ))}
        </div>

        <label htmlFor="set-search">Search expansion sets</label>
        <input
          id="set-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by set name..."
          disabled={loading}
        />

        <label htmlFor="set-sort">Sort sets</label>
        <select
          id="set-sort"
          value={sortMode}
          onChange={(event) => setSortMode(event.target.value)}
          disabled={loading}
        >
          <option value="release-oldest">Release year: oldest first</option>
          <option value="release-newest">Release year: newest first</option>
          <option value="name">Name: A to Z</option>
        </select>

        <div className="set-grid" aria-label="Expansion sets">
          {visibleExpansions.map(([key, expansion]) => (
            <button
              key={key}
              type="button"
              className={`set-card nes-btn ${selectedSet === key ? 'is-selected is-primary' : ''}`}
              onClick={() => chooseSet(key)}
            >
              {expansion.logo && (
                <img
                  className="set-card-logo"
                  src={expansion.logo}
                  alt={`${expansion.setName} logo`}
                  loading="lazy"
                />
              )}
              <span className="set-card-name">{expansion.setName}</span>
              <span className="set-card-series">
                {expansion.symbol && (
                  <img
                    className="set-card-symbol"
                    src={expansion.symbol}
                    alt=""
                    loading="lazy"
                  />
                )}
                {expansion.series}
              </span>
              <span className="set-card-date">{expansion.releaseYear || 'Unknown year'}</span>
            </button>
          ))}
        </div>

        <div className="button-group">
          <button
            onClick={openPack}
            disabled={loading || !selectedSetIsPlayable}
            className="btn btn-primary nes-btn is-success"
          >
            {loading ? 'Loading Database...' : 'Open 1 Pack'}
          </button>
          <button
            onClick={openTenPacks}
            disabled={loading || !selectedSetIsPlayable}
            className="btn btn-secondary btn-ten-pack nes-btn is-warning"
          >
            Open 10 Packs
          </button>
          <button
            onClick={openRandomPack}
            disabled={loading || !allExpansions}
            className="btn btn-random-pack nes-btn is-primary"
          >
            Open Random Pack
          </button>
          <button
            onClick={openGodPack}
            disabled={loading || !selectedSetIsPlayable}
            className="btn btn-god nes-btn is-primary"
          >
            Open God Pack
          </button>
          <button
            onClick={clearBinder}
            disabled={!Object.keys(collection).length}
            className="btn btn-danger nes-btn is-error"
          >
            Clear Binder
          </button>
        </div>
      </div>

      <section className="binder-panel" aria-label="Collection binder">
        <div className="binder-header">
          <div>
            <h2>Binder</h2>
            <p>
              {activeSet?.setName || 'Selected set'} collection progress:{' '}
              {ownedActiveSetCards.length} / {activeSetCards.length} unique cards
            </p>
          </div>
          <strong className={`binder-progress progress-label-${progressLevel}`}>
            {binderProgress}%
          </strong>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div
            className={`progress-fill progress-${progressLevel}`}
            style={{ width: `${binderProgress}%` }}
          />
        </div>
        <label htmlFor="binder-search">Search binder cards</label>
        <input
          id="binder-search"
          type="search"
          value={binderSearchTerm}
          onChange={(event) => setBinderSearchTerm(event.target.value)}
          placeholder="Search Pokemon in this set..."
        />
        <div className="binder-grid">
          {visibleBinderCards.map((card) => {
            const ownedCard = collection[card.id];
            return (
              <article
                key={card.id}
                className={`binder-card ${ownedCard ? 'is-owned' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => openBinderCard(card)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openBinderCard(card);
                  }
                }}
              >
                <img
                  src={getCardFaceImage(card)}
                  data-fallback-src={getCardFallbackImage(card)}
                  alt={card.name}
                  loading="lazy"
                  onError={handleCardImageError}
                />
                <div>
                  <h3>{card.name}</h3>
                  <p>Owned x {ownedCard?.count || 0}</p>
                </div>
              </article>
            );
          })}
          {!visibleBinderCards.length && (
            <p className="pokedex-status">No cards match this binder search.</p>
          )}
        </div>
      </section>

      {showClearBinderDialog && (
        <div
          className="clear-dialog-overlay"
          role="presentation"
          onClick={() => setShowClearBinderDialog(false)}
        >
          <div
            className="clear-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="clear-dialog-title">Clear Binder?</h2>
            <p>This will remove every card from your binder collection.</p>
            <div className="clear-dialog-actions">
              <button
                type="button"
                className="nes-btn"
                onClick={() => setShowClearBinderDialog(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger nes-btn is-error"
                onClick={confirmClearBinder}
              >
                Clear Binder
              </button>
            </div>
          </div>
        </div>
      )}

      {showPackModal && currentPack.length > 0 && (
        <div className="pack-reveal-overlay" role="dialog" aria-modal="true">
          <div className="pack-reveal-modal">
            <div className="pack-reveal-header">
              <div className="pack-set-info">
                {currentPackSet?.logo && (
                  <img
                    className="pack-set-logo"
                    src={currentPackSet.logo}
                    alt={`${currentPackSet.setName} logo`}
                  />
                )}
                <span className="pack-release-year">
                  Release Year: {currentPackSet?.releaseYear || 'Unknown year'}
                </span>
              </div>
              <button
                type="button"
                className="modal-close nes-btn"
                onClick={() => setShowPackModal(false)}
                disabled={isPreparingPack || isAutoRevealing}
              >
                Close
              </button>
            </div>

            {isPreparingPack && (
              <div className="pack-loading-state" role="status">
                <div className="pack-loader-ball" aria-hidden="true" />
                <p>Preparing booster pack...</p>
              </div>
            )}

            {currentPack.length > 0 && !isPreparingPack && (
              <div
                className={`pack-grid ${
                  currentPack.length > 20 ? 'is-scrollable' : ''
                }`}
              >
                {currentPack.map((card) => (
                  <div
                    key={card.packId}
                    className={`card-container ${card.flipped ? 'is-flipped' : ''}`}
                    onClick={() => flipCard(card.packId)}
                  >
                    <div className="card-inner">
                      <div className="card-front">
                        <img
                          src={getCardFaceImage(card)}
                          data-fallback-src={getCardFallbackImage(card)}
                          alt={card.name}
                          onError={handleCardImageError}
                        />
                        {card.isRare && <div className="holo-overlay" aria-hidden="true" />}
                        {card.isNewPull && <span className="new-card-badge">New</span>}
                      </div>
                      <div className="card-back">
                        <img
                          className="card-back-image"
                          src={CARD_BACK_IMAGE}
                          alt="Pokemon card back"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pack-actions pack-reveal-actions">
              <button
                type="button"
                className="btn btn-primary nes-btn is-success"
                onClick={openPack}
                disabled={loading || !selectedSetIsPlayable || isPreparingPack || isAutoRevealing}
              >
                Open 1 Pack
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-ten-pack nes-btn is-warning"
                onClick={openTenPacks}
                disabled={loading || !selectedSetIsPlayable || isPreparingPack || isAutoRevealing}
              >
                Open 10 Packs
              </button>
              <button
                type="button"
                className="btn btn-random-pack nes-btn is-primary"
                onClick={openRandomPack}
                disabled={loading || !allExpansions || isPreparingPack || isAutoRevealing}
              >
                Random Pack
              </button>
              <button
                type="button"
                className="btn btn-god nes-btn is-primary"
                onClick={openGodPack}
                disabled={loading || !selectedSetIsPlayable || isPreparingPack || isAutoRevealing}
              >
                Open God Pack
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCard && (
        <div
          className="card-detail-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="card-detail-title"
          onClick={() => setSelectedCard(null)}
        >
          <div className="card-detail-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close nes-btn"
              onClick={() => setSelectedCard(null)}
              aria-label="Close card details"
            >
              Close
            </button>
            <div
              className={`card-detail-image-wrap ${
                selectedCard.isOwnedInBinder === false ? 'is-unowned' : ''
              }`}
              onPointerMove={(event) => {
                const card = event.currentTarget;
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                card.style.setProperty('--pointer-x', `${x * 100}%`);
                card.style.setProperty('--pointer-y', `${y * 100}%`);
                card.style.setProperty('--rotate-x', `${(0.5 - y) * 24}deg`);
                card.style.setProperty('--rotate-y', `${(x - 0.5) * 24}deg`);
                card.style.setProperty('--card-shift-x', `${(x - 0.5) * 10}px`);
                card.style.setProperty('--card-shift-y', `${(y - 0.5) * 10}px`);
              }}
              onPointerLeave={(event) => {
                const card = event.currentTarget;
                card.style.setProperty('--pointer-x', '50%');
                card.style.setProperty('--pointer-y', '50%');
                card.style.setProperty('--rotate-x', '0deg');
                card.style.setProperty('--rotate-y', '0deg');
                card.style.setProperty('--card-shift-x', '0px');
                card.style.setProperty('--card-shift-y', '0px');
              }}
            >
              <img
                src={getCardFaceImage(selectedCard)}
                data-fallback-src={getCardFallbackImage(selectedCard)}
                alt={selectedCard.name}
                onError={handleCardImageError}
              />
              {selectedCard.isRare && <div className="holo-overlay" aria-hidden="true" />}
            </div>
            <div className="card-detail-info">
              <p className="card-detail-set">{selectedCard.setName}</p>
              <h2 id="card-detail-title">{selectedCard.name}</h2>
              <dl className="card-detail-meta">
                <div>
                  <dt>Rarity</dt>
                  <dd>{selectedCard.rarity || 'Unknown'}</dd>
                </div>
                <div>
                  <dt>Number</dt>
                  <dd>{selectedCard.number || 'N/A'}</dd>
                </div>
                <div>
                  <dt>HP</dt>
                  <dd>{selectedCard.hp || 'N/A'}</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{selectedCard.types?.join(', ') || 'N/A'}</dd>
                </div>
                <div>
                  <dt>Stage</dt>
                  <dd>{selectedCard.subtypes?.join(', ') || selectedCard.supertype || 'N/A'}</dd>
                </div>
                <div>
                  <dt>Artist</dt>
                  <dd>{selectedCard.artist || 'Unknown'}</dd>
                </div>
              </dl>
              {selectedCard.evolvesFrom && (
                <p className="detail-copy">Evolves from {selectedCard.evolvesFrom}</p>
              )}
              {selectedCard.flavorText && (
                <p className="detail-copy">{selectedCard.flavorText}</p>
              )}
              {selectedCard.abilities?.length > 0 && (
                <section className="detail-section">
                  <h3>Abilities</h3>
                  {selectedCard.abilities.map((ability) => (
                    <article key={`${ability.name}-${ability.type}`}>
                      <strong>{ability.name}</strong>
                      <p>{ability.text}</p>
                    </article>
                  ))}
                </section>
              )}
              {selectedCard.attacks?.length > 0 && (
                <section className="detail-section">
                  <h3>Attacks</h3>
                  {selectedCard.attacks.map((attack) => (
                    <article key={`${attack.name}-${attack.damage}`}>
                      <strong>
                        {attack.name} {attack.damage && `- ${attack.damage}`}
                      </strong>
                      <p>{attack.text || 'No attack text.'}</p>
                    </article>
                  ))}
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WhosThatPokemonPage({ onBack, onOpenPokedex, onOpenTcg }) {
  const regionOptions = useMemo(
    () => [
      { id: 'random', label: 'Random Region', region: 'Surprise' },
      ...POKEDEX_OPTIONS,
    ],
    [],
  );
  const [setupName, setSetupName] = useState('');
  const [selectedRegionId, setSelectedRegionId] = useState('random');
  const [playerName, setPlayerName] = useState('');
  const [entriesByRegion, setEntriesByRegion] = useState({});
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [guess, setGuess] = useState('');
  const [roundState, setRoundState] = useState('setup');
  const [result, setResult] = useState(null);
  const [showHintChoices, setShowHintChoices] = useState(false);
  const [hintChoices, setHintChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [roundCount, setRoundCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState(loadWhoLeaderboard);
  const [tcgCards, setTcgCards] = useState([]);
  const [loadingTcgCards, setLoadingTcgCards] = useState(true);
  const [showEntryOverlay, setShowEntryOverlay] = useState(false);
  const [showGameMenu, setShowGameMenu] = useState(false);
  const [selectedTcgCard, setSelectedTcgCard] = useState(null);
  const [entrySpecies, setEntrySpecies] = useState(null);
  const [entryLoading, setEntryLoading] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [showResetLeaderboardDialog, setShowResetLeaderboardDialog] = useState(false);
  const [error, setError] = useState('');
  const sessionIdRef = useRef('');
  const guessInputRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/expansions.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load TCG card data.');
        }
        return response.json();
      })
      .then((data) => {
        const allCards = Object.values(data)
          .filter((expansion) => hasPlayableCards(expansion))
          .flatMap((expansion) =>
            [...expansion.commons, ...expansion.uncommons, ...expansion.rares].map((card) => ({
              ...card,
              setName: expansion.setName,
              setId: expansion.setId,
            })),
          );
        setTcgCards(allCards);
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingTcgCards(false);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!showEntryOverlay || !currentPokemon?.species?.url) {
      return undefined;
    }

    const controller = new AbortController();

    fetch(currentPokemon.species.url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load Pokemon species data.');
        }
        return response.json();
      })
      .then((data) => {
        setEntrySpecies(data);
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setEntryLoading(false);
        }
      });

    return () => controller.abort();
  }, [showEntryOverlay, currentPokemon]);

  const loadRegionEntries = useCallback((regionId) => {
    const cachedEntries = entriesByRegion[regionId];
    if (cachedEntries?.length) {
      return Promise.resolve(cachedEntries);
    }

    return fetch(`${POKEAPI_BASE_URL}/pokedex/${regionId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load this Pokedex.');
        }
        return response.json();
      })
      .then((data) => {
        const entries = buildPokedexEntries([data], false);
        setEntriesByRegion((previousEntries) => ({
          ...previousEntries,
          [regionId]: entries,
        }));
        return entries;
      });
  }, [entriesByRegion]);

  const recordLeaderboardScore = useCallback((nextScore) => {
    if (!playerName) return;

    const entry = {
      id: sessionIdRef.current,
      name: playerName,
      playedAt: new Date().toISOString(),
      score: nextScore,
    };

    setLeaderboard((previousLeaderboard) => {
      const nextLeaderboard = [
        entry,
        ...previousLeaderboard.filter((leaderboardEntry) => leaderboardEntry.id !== entry.id),
      ]
        .sort((firstEntry, secondEntry) => {
          if (secondEntry.score !== firstEntry.score) {
            return secondEntry.score - firstEntry.score;
          }
          return new Date(secondEntry.playedAt) - new Date(firstEntry.playedAt);
        })
        .slice(0, 12);

      saveWhoLeaderboard(nextLeaderboard);
      return nextLeaderboard;
    });
  }, [playerName]);

  const startNextRound = useCallback(() => {
    const regionId =
      selectedRegionId === 'random'
        ? randomItem(POKEDEX_OPTIONS).id
        : selectedRegionId;
    const nextRegion = POKEDEX_OPTIONS.find((region) => region.id === regionId);

    setRoundState('loading');
    setResult(null);
    setShowHintChoices(false);
    setHintChoices([]);
    setGuess('');
    setCurrentPokemon(null);
    setCurrentRegion(nextRegion);
    setShowEntryOverlay(false);
    setError('');

    loadRegionEntries(regionId)
      .then((entries) => {
        const randomPokemon = randomItem(entries);
        if (!randomPokemon) {
          throw new Error('No Pokemon available for this region.');
        }
        return fetchPokemonByNameOrSpecies(randomPokemon.name).then((pokemon) => ({
          pokemon,
          entries,
        }));
      })
      .then(({ pokemon, entries }) => {
        setCurrentPokemon(pokemon);
        setHintChoices(buildPokemonHintChoices(pokemon, entries));
        setRoundState('guessing');
      })
      .catch((fetchError) => {
        setRoundState('setup');
        setError(fetchError.message);
      });
  }, [loadRegionEntries, selectedRegionId]);

  const startGame = (event) => {
    event.preventDefault();
    const trimmedName = setupName.trim();

    if (!trimmedName) {
      setError('');
      setShowNameDialog(true);
      return;
    }

    sessionIdRef.current = `who-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setPlayerName(trimmedName.slice(0, 24));
    setScore(0);
    setRoundCount(0);
    setError('');
    setResult(null);
    setShowEntryOverlay(false);
    setShowNameDialog(false);
    startNextRound();
  };

  const submitPokemonGuess = (guessValue) => {
    if (!currentPokemon || roundState !== 'guessing') {
      return;
    }

    const trimmedGuess = guessValue.trim();

    if (!trimmedGuess) {
      setError('Enter a Pokemon name to guess.');
      return;
    }

    const guessedCorrectly = isPokemonGuessCorrect(trimmedGuess, currentPokemon);
    const nextScore = guessedCorrectly ? score + 1 : score;

    setResult(guessedCorrectly ? 'correct' : 'wrong');
    setRoundState('revealed');
    setShowHintChoices(false);
    setRoundCount((previousCount) => previousCount + 1);
    setError('');

    if (guessedCorrectly) {
      setScore(nextScore);
    }

    recordLeaderboardScore(nextScore);
  };

  const submitGuess = (event) => {
    event.preventDefault();
    submitPokemonGuess(guess);
  };

  useEffect(() => {
    if (roundState !== 'guessing') {
      return undefined;
    }

    const focusTimer = window.setTimeout(() => {
      guessInputRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [roundState, currentPokemon]);

  useEffect(() => {
    if (
      roundState !== 'revealed' ||
      showEntryOverlay ||
      showGameMenu ||
      selectedTcgCard ||
      showResetLeaderboardDialog
    ) {
      return undefined;
    }

    const handleNextRoundKey = (event) => {
      if (event.key !== 'Enter' || event.repeat) {
        return;
      }

      event.preventDefault();
      startNextRound();
    };

    window.addEventListener('keydown', handleNextRoundKey);

    return () => {
      window.removeEventListener('keydown', handleNextRoundKey);
    };
  }, [
    result,
    roundState,
    selectedTcgCard,
    showEntryOverlay,
    showGameMenu,
    showResetLeaderboardDialog,
    startNextRound,
  ]);

  const resetGame = () => {
    setPlayerName('');
    setSetupName('');
    setCurrentPokemon(null);
    setCurrentRegion(null);
    setGuess('');
    setRoundState('setup');
    setResult(null);
    setShowHintChoices(false);
    setHintChoices([]);
    setScore(0);
    setRoundCount(0);
    setError('');
    setShowEntryOverlay(false);
    setShowGameMenu(false);
    setSelectedTcgCard(null);
    setShowNameDialog(false);
    setShowResetLeaderboardDialog(false);
  };

  const changeRegion = () => {
    setSetupName(playerName);
    setPlayerName('');
    setCurrentPokemon(null);
    setCurrentRegion(null);
    setGuess('');
    setRoundState('setup');
    setResult(null);
    setShowHintChoices(false);
    setHintChoices([]);
    setScore(0);
    setRoundCount(0);
    setError('');
    setShowEntryOverlay(false);
    setShowGameMenu(false);
    setSelectedTcgCard(null);
    setShowNameDialog(false);
    setShowResetLeaderboardDialog(false);
  };

  const resetLeaderboard = () => {
    saveWhoLeaderboard([]);
    setLeaderboard([]);
    setShowResetLeaderboardDialog(false);
  };

  const openEntryOverlay = () => {
    setEntrySpecies(null);
    setEntryLoading(true);
    setShowEntryOverlay(true);
  };
  const officialArtwork =
    currentPokemon?.sprites?.other?.['official-artwork']?.front_default ||
    currentPokemon?.sprites?.front_default;
  const featuredCards = useMemo(
    () => getFeaturedTcgCards(tcgCards, [currentPokemon?.name, currentPokemon?.species?.name]),
    [tcgCards, currentPokemon],
  );
  const answerName = currentPokemon ? formatPokemonName(currentPokemon.species?.name || currentPokemon.name) : '';
  const activeRegionLabel =
    selectedRegionId === 'random'
      ? 'Random Region'
      : POKEDEX_OPTIONS.find((region) => region.id === selectedRegionId)?.region || 'Region';

  if (roundState === 'setup') {
    return (
      <div className="app-container who-page">
        <header className="app-header">
          <button type="button" className="brand-mark brand-home-button" onClick={onBack}>
            <span className="nes-pokeball brand-pokeball" aria-hidden="true" />
            <h1>Who's That Pokemon?</h1>
          </button>
          <div className="header-actions">
            <button type="button" className="nes-btn nav-button" onClick={onBack}>
              Home
            </button>
            <button type="button" className="nes-btn nav-button" onClick={onOpenPokedex}>
              Pokedex
            </button>
            <button type="button" className="nes-btn nav-button" onClick={onOpenTcg}>
              TCG
            </button>
            <GitHubRepoLink />
          </div>
        </header>

        <section className="who-setup-layout">
          <form className="who-setup-panel" onSubmit={startGame}>
            <div>
              <p className="card-detail-set">Trainer setup</p>
              <h2>Choose your challenge</h2>
            </div>

            <label htmlFor="who-player-name">Trainer name</label>
            <div className="who-name-row">
              <input
                id="who-player-name"
                type="text"
                value={setupName}
                onChange={(event) => setSetupName(event.target.value)}
                placeholder="Enter your name..."
                maxLength="24"
              />
              <button type="submit" className="nes-btn is-success">
                Start Game
              </button>
            </div>

            <label>Region</label>
            <div className="who-region-grid" aria-label="Region selection">
              {regionOptions.map((region) => {
                const isRandomRegion = region.id === 'random';

                return (
                  <button
                    key={region.id}
                    type="button"
                    className={`who-region-card nes-btn ${
                      selectedRegionId === region.id ? 'is-primary is-selected' : ''
                    }`}
                    onClick={() => setSelectedRegionId(region.id)}
                  >
                    <span className="who-region-art" aria-hidden="true">
                      {isRandomRegion ? (
                        <img
                          className="who-random-icon"
                          src={unownQuestionMark}
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        region.starters.map((starterId) => (
                          <span key={starterId} className="who-region-pokemon-preview">
                            <img
                              src={getPokemonOfficialArtworkUrl(starterId)}
                              alt=""
                              loading="lazy"
                              onError={(event) => {
                                event.currentTarget.src = getPokemonSpriteUrl(starterId);
                              }}
                            />
                          </span>
                        ))
                      )}
                    </span>
                    <strong>{isRandomRegion ? region.label : region.region}</strong>
                    <span>{isRandomRegion ? 'Any listed Pokedex' : region.label}</span>
                  </button>
                );
              })}
            </div>

            {error && <p className="pokedex-error">{error}</p>}

          </form>

          <section className="who-leaderboard who-setup-leaderboard" aria-label="Leaderboard">
            <div className="who-leaderboard-heading">
              <h2>Leaderboard</h2>
              <button
                type="button"
                className="nes-btn is-error"
                onClick={() => setShowResetLeaderboardDialog(true)}
                disabled={!leaderboard.length}
              >
                Reset
              </button>
            </div>
            <div className="who-leaderboard-list">
              {leaderboard.map((entry, index) => (
                <article key={entry.id} className="who-leaderboard-row">
                  <strong>#{index + 1}</strong>
                  <span>{entry.name}</span>
                  <span>{formatLeaderboardDate(entry.playedAt)}</span>
                  <strong>{entry.score}</strong>
                </article>
              ))}
              {!leaderboard.length && (
                <p className="pokedex-status">No scores yet.</p>
              )}
            </div>
          </section>

          {showNameDialog && (
            <div
              className="clear-dialog-overlay"
              role="presentation"
              onClick={() => setShowNameDialog(false)}
            >
              <div
                className="clear-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="who-name-dialog-title"
                onClick={(event) => event.stopPropagation()}
              >
                <h2 id="who-name-dialog-title">Name Required</h2>
                <p>Trainer name cannot be empty. Please enter a name before starting.</p>
                <div className="clear-dialog-actions">
                  <button
                    type="button"
                    className="nes-btn is-success"
                    onClick={() => setShowNameDialog(false)}
                    autoFocus
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}

          {showResetLeaderboardDialog && (
            <div
              className="clear-dialog-overlay"
              role="presentation"
              onClick={() => setShowResetLeaderboardDialog(false)}
            >
              <div
                className="clear-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="who-reset-leaderboard-title"
                onClick={(event) => event.stopPropagation()}
              >
                <h2 id="who-reset-leaderboard-title">Reset Leaderboard?</h2>
                <p>This will remove every score from the Who's That Pokemon leaderboard.</p>
                <div className="clear-dialog-actions">
                  <button
                    type="button"
                    className="nes-btn"
                    onClick={() => setShowResetLeaderboardDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="nes-btn is-error"
                    onClick={resetLeaderboard}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="app-container who-page who-game-route">
      <header className="app-header who-game-header">
        <button type="button" className="brand-mark brand-home-button" onClick={onBack}>
          <span className="nes-pokeball brand-pokeball" aria-hidden="true" />
          <h1>Who's That Pokemon?</h1>
        </button>
        <div className="header-actions">
          <button type="button" className="nes-btn nav-button" onClick={onBack}>
            Home
          </button>
          <button type="button" className="nes-btn nav-button" onClick={onOpenPokedex}>
            Pokedex
          </button>
          <button type="button" className="nes-btn nav-button" onClick={onOpenTcg}>
            TCG
          </button>
          <GitHubRepoLink />
        </div>
      </header>

      <section className="who-play-shell">
        <main className="who-game-panel">
          <button
            type="button"
            className="who-menu-button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setShowGameMenu(true);
            }}
            aria-label="Open game menu"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
          <img
            className="who-bg-image"
            src={whosThatPokemonBg}
            alt=""
            aria-hidden="true"
          />

          {roundState === 'loading' && (
            <div className="who-empty-state">
              <div className="pack-loader-ball" aria-hidden="true" />
              <p>Finding a mystery Pokemon...</p>
            </div>
          )}

          {currentPokemon && roundState !== 'loading' && (
            <div className="who-stage">
              <button
                type="button"
                className={`who-pokemon-button ${roundState === 'revealed' ? 'is-revealed' : ''}`}
                onClick={openEntryOverlay}
                disabled={roundState !== 'revealed'}
                aria-label={
                  roundState === 'revealed'
                    ? `Open ${answerName} Pokedex entry`
                    : 'Mystery Pokemon silhouette'
                }
                style={officialArtwork ? { '--pokemon-art': `url(${officialArtwork})` } : undefined}
              >
                {officialArtwork && (
                  <>
                    <span className="who-pokemon-layer who-pokemon-silhouette" aria-hidden="true" />
                    <span className="who-pokemon-layer who-pokemon-revealed-art" aria-hidden="true" />
                    <span className="who-pokemon-preload" aria-hidden="true">
                      <img src={officialArtwork} alt="" />
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </main>

        {currentPokemon && roundState !== 'loading' && (
          <form className="who-guess-panel" onSubmit={submitGuess}>
            <div className="who-guess-heading">
              <div>
                <p className="card-detail-set">
                  {currentRegion?.region || 'Region'} Pokemon
                </p>
                <h2>
                  {roundState === 'revealed'
                    ? answerName
                    : "Who's that Pokemon?"}
                </h2>
              </div>
              <dl className="who-live-score" aria-label="Current score">
                <div>
                  <dt>Score</dt>
                  <dd>{score}</dd>
                </div>
                <div>
                  <dt>Rounds</dt>
                  <dd>{roundCount}</dd>
                </div>
              </dl>
              {result && (
                <p className={`who-result is-${result}`}>
                  {result === 'correct'
                    ? 'Correct! Click the Pokemon to open its entry.'
                    : `It was ${answerName}. Click the Pokemon to learn more.`}
                </p>
              )}
              {error && <p className="who-result is-wrong">{error}</p>}
            </div>

            {roundState === 'guessing' && (
              <div className="who-guess-controls">
                <div className="who-guess-row">
                  <input
                    ref={guessInputRef}
                    type="search"
                    value={guess}
                    onChange={(event) => setGuess(event.target.value)}
                    placeholder="Pokemon name..."
                  />
                  <button
                    type="button"
                    className="nes-btn is-warning"
                    onClick={() => setShowHintChoices((isShowing) => !isShowing)}
                    disabled={!hintChoices.length}
                  >
                    Help
                  </button>
                  <button type="submit" className="nes-btn is-success">
                    Guess
                  </button>
                </div>
                {showHintChoices && (
                  <div className="who-hint-grid" aria-label="Pokemon name choices">
                    {hintChoices.map((choice) => (
                      <button
                        key={choice.name}
                        type="button"
                        className="nes-btn"
                        onClick={() => {
                          setGuess(choice.label);
                          submitPokemonGuess(choice.name);
                        }}
                      >
                    {choice.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {roundState === 'revealed' && (
              <button type="button" className="nes-btn is-primary" onClick={startNextRound}>
                Next Pokemon
              </button>
            )}
          </form>
        )}
      </section>

      {showGameMenu && (
        <div
          className="who-menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="who-menu-title"
          onClick={() => setShowGameMenu(false)}
        >
          <aside className="who-menu-panel" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close nes-btn"
              onClick={() => setShowGameMenu(false)}
              aria-label="Close menu"
            >
              Close
            </button>
            <div className="who-score-panel">
              <p className="card-detail-set">{activeRegionLabel}</p>
              <h2 id="who-menu-title">{playerName}</h2>
              <dl className="who-score-list">
                <div>
                  <dt>Score</dt>
                  <dd>{score}</dd>
                </div>
                <div>
                  <dt>Rounds</dt>
                  <dd>{roundCount}</dd>
                </div>
                <div>
                  <dt>Current Region</dt>
                  <dd>{currentRegion?.region || 'Loading'}</dd>
                </div>
              </dl>
              <div className="who-menu-actions">
                <button type="button" className="nes-btn is-primary" onClick={changeRegion}>
                  Change Region
                </button>
                <button type="button" className="nes-btn is-error" onClick={resetGame}>
                  New Player
                </button>
              </div>
            </div>

            {error && <p className="pokedex-error">{error}</p>}

            <section className="who-leaderboard" aria-label="Leaderboard">
              <div className="who-leaderboard-heading">
                <h2>Leaderboard</h2>
                <button
                  type="button"
                  className="nes-btn is-error"
                  onClick={() => setShowResetLeaderboardDialog(true)}
                  disabled={!leaderboard.length}
                >
                  Reset
                </button>
              </div>
              <div className="who-leaderboard-list">
                {leaderboard.map((entry, index) => (
                  <article key={entry.id} className="who-leaderboard-row">
                    <strong>#{index + 1}</strong>
                    <span>{entry.name}</span>
                    <span>{formatLeaderboardDate(entry.playedAt)}</span>
                    <strong>{entry.score}</strong>
                  </article>
                ))}
                {!leaderboard.length && (
                  <p className="pokedex-status">No scores yet.</p>
                )}
              </div>
            </section>
          </aside>
        </div>
      )}

      {showResetLeaderboardDialog && (
        <div
          className="clear-dialog-overlay"
          role="presentation"
          onClick={() => setShowResetLeaderboardDialog(false)}
        >
          <div
            className="clear-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="who-reset-leaderboard-game-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="who-reset-leaderboard-game-title">Reset Leaderboard?</h2>
            <p>This will remove every score from the Who's That Pokemon leaderboard.</p>
            <div className="clear-dialog-actions">
              <button
                type="button"
                className="nes-btn"
                onClick={() => setShowResetLeaderboardDialog(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="nes-btn is-error"
                onClick={resetLeaderboard}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {showEntryOverlay && currentPokemon && (
        <div
          className="who-entry-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="who-entry-title"
          onClick={() => setShowEntryOverlay(false)}
        >
          <div className="who-entry-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close nes-btn"
              onClick={() => setShowEntryOverlay(false)}
              aria-label="Back to game"
            >
              Back
            </button>

            <div className="who-entry-main">
              <div className="pokedex-card-media">
                {officialArtwork && <img src={officialArtwork} alt={answerName} />}
              </div>
              <div className="pokedex-card-info">
                <p className="card-detail-set">#{String(currentPokemon.id).padStart(3, '0')}</p>
                <h2 id="who-entry-title">{answerName}</h2>
                <div className="type-row">
                  {currentPokemon.types.map(({ type }) => (
                    <span key={type.name} className={`type-badge type-${type.name}`}>
                      <img src={TYPE_ICONS[type.name]} alt="" aria-hidden="true" />
                      {type.name}
                    </span>
                  ))}
                </div>
                <section className="pokedex-section flavor-section">
                  {entryLoading && <p>Loading Pokedex entry...</p>}
                  {!entryLoading && (
                    <p>{getEnglishFlavorText(entrySpecies) || 'No English flavor text found.'}</p>
                  )}
                </section>
                <dl className="profile-list">
                  <div>
                    <dt>Species</dt>
                    <dd>
                      {entrySpecies?.genera?.find((genus) => genus.language.name === 'en')?.genus ||
                        'Unknown'}
                    </dd>
                  </div>
                  <div>
                    <dt>Height</dt>
                    <dd>{currentPokemon.height / 10} m</dd>
                  </div>
                  <div>
                    <dt>Weight</dt>
                    <dd>{currentPokemon.weight / 10} kg</dd>
                  </div>
                </dl>
              </div>
            </div>

            <section className="pokedex-section who-featured-section">
              <h3>Featured TCG Cards</h3>
              {loadingTcgCards && <p className="pokedex-status">Loading TCG cards...</p>}
              {!loadingTcgCards && (
                <div className="who-featured-grid">
                  {featuredCards.slice(0, 8).map((card) => (
                    <article
                      key={`${card.setId}-${card.id}`}
                      className="binder-card is-owned"
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedTcgCard(card)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setSelectedTcgCard(card);
                        }
                      }}
                    >
                      <img
                        src={getCardFaceImage(card)}
                        data-fallback-src={getCardFallbackImage(card)}
                        alt={card.name}
                        loading="lazy"
                        onError={handleCardImageError}
                      />
                      <div>
                        <h3>{card.name}</h3>
                        <p>{card.setName}</p>
                      </div>
                    </article>
                  ))}
                  {!featuredCards.length && (
                    <p className="pokedex-status">No local TCG cards found for this Pokemon.</p>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {selectedTcgCard && (
        <div
          className="card-detail-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="who-tcg-card-detail-title"
          onClick={() => setSelectedTcgCard(null)}
        >
          <div className="card-detail-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close nes-btn"
              onClick={() => setSelectedTcgCard(null)}
              aria-label="Close card details"
            >
              Close
            </button>
            <div
              className="card-detail-image-wrap"
              onPointerMove={(event) => {
                const card = event.currentTarget;
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                card.style.setProperty('--pointer-x', `${x * 100}%`);
                card.style.setProperty('--pointer-y', `${y * 100}%`);
                card.style.setProperty('--rotate-x', `${(0.5 - y) * 24}deg`);
                card.style.setProperty('--rotate-y', `${(x - 0.5) * 24}deg`);
                card.style.setProperty('--card-shift-x', `${(x - 0.5) * 10}px`);
                card.style.setProperty('--card-shift-y', `${(y - 0.5) * 10}px`);
              }}
              onPointerLeave={(event) => {
                const card = event.currentTarget;
                card.style.setProperty('--pointer-x', '50%');
                card.style.setProperty('--pointer-y', '50%');
                card.style.setProperty('--rotate-x', '0deg');
                card.style.setProperty('--rotate-y', '0deg');
                card.style.setProperty('--card-shift-x', '0px');
                card.style.setProperty('--card-shift-y', '0px');
              }}
            >
              <img
                src={getCardFaceImage(selectedTcgCard)}
                data-fallback-src={getCardFallbackImage(selectedTcgCard)}
                alt={selectedTcgCard.name}
                onError={handleCardImageError}
              />
              {selectedTcgCard.isRare && <div className="holo-overlay" aria-hidden="true" />}
            </div>
            <div className="card-detail-info">
              <p className="card-detail-set">{selectedTcgCard.setName}</p>
              <h2 id="who-tcg-card-detail-title">{selectedTcgCard.name}</h2>
              <dl className="card-detail-meta">
                <div>
                  <dt>Rarity</dt>
                  <dd>{selectedTcgCard.rarity || 'Unknown'}</dd>
                </div>
                <div>
                  <dt>Number</dt>
                  <dd>{selectedTcgCard.number || 'N/A'}</dd>
                </div>
                <div>
                  <dt>HP</dt>
                  <dd>{selectedTcgCard.hp || 'N/A'}</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{selectedTcgCard.types?.join(', ') || 'N/A'}</dd>
                </div>
                <div>
                  <dt>Stage</dt>
                  <dd>{selectedTcgCard.subtypes?.join(', ') || selectedTcgCard.supertype || 'N/A'}</dd>
                </div>
                <div>
                  <dt>Artist</dt>
                  <dd>{selectedTcgCard.artist || 'Unknown'}</dd>
                </div>
              </dl>
              {selectedTcgCard.evolvesFrom && (
                <p className="detail-copy">Evolves from {selectedTcgCard.evolvesFrom}</p>
              )}
              {selectedTcgCard.flavorText && (
                <p className="detail-copy">{selectedTcgCard.flavorText}</p>
              )}
              {selectedTcgCard.abilities?.length > 0 && (
                <section className="detail-section">
                  <h3>Abilities</h3>
                  {selectedTcgCard.abilities.map((ability) => (
                    <article key={`${ability.name}-${ability.type}`}>
                      <strong>{ability.name}</strong>
                      <p>{ability.text}</p>
                    </article>
                  ))}
                </section>
              )}
              {selectedTcgCard.attacks?.length > 0 && (
                <section className="detail-section">
                  <h3>Attacks</h3>
                  {selectedTcgCard.attacks.map((attack) => (
                    <article key={`${attack.name}-${attack.damage}`}>
                      <strong>
                        {attack.name} {attack.damage && `- ${attack.damage}`}
                      </strong>
                      <p>{attack.text || 'No attack text.'}</p>
                    </article>
                  ))}
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HomePage({ onChoose }) {
  return (
    <main className="home-screen">
      <div className="home-repo-link">
        <GitHubRepoLink />
      </div>
      <section className="home-hero">
        <div className="home-brand">
          <span className="nes-pokeball home-pokeball" aria-hidden="true" />
          <div>
            <p className="eyebrow">Pokemon Lab</p>
            <h1>Choose Your Station</h1>
          </div>
        </div>

        <div className="choice-grid" aria-label="Choose an app">
          <button
            type="button"
            className="choice-card nes-btn is-error"
            onClick={() => onChoose('pokedex')}
          >
            <span className="choice-icon" aria-hidden="true">
              #
            </span>
            <span className="choice-title">Pokedex</span>
            <span className="choice-copy">
              Search Pokemon by name or number using live PokeAPI data.
            </span>
          </button>

          <button
            type="button"
            className="choice-card nes-btn is-primary"
            onClick={() => onChoose('tcg')}
          >
            <span className="choice-icon" aria-hidden="true">
              TCG
            </span>
            <span className="choice-title">Pokemon TCG Simulator</span>
            <span className="choice-copy">
              Open booster packs, reveal cards, and build your binder.
            </span>
          </button>

          <button
            type="button"
            className="choice-card nes-btn is-warning"
            onClick={() => onChoose('who')}
          >
            <span className="choice-icon" aria-hidden="true">
              ?
            </span>
            <span className="choice-title">Who's That Pokemon?</span>
            <span className="choice-copy">
              Guess silhouetted Pokemon by region and climb the leaderboard.
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}

function GitHubRepoLink() {
  return (
    <a
      className="repo-link"
      href={REPOSITORY_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Open GitHub repository"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 3.86c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
    </a>
  );
}

function EvolutionBranch({ node, onChoosePokemon }) {
  if (!node) return null;

  return (
    <div className="evolution-branch">
      <article
        className="evolution-node"
        role="button"
        tabIndex={0}
        onClick={() => onChoosePokemon(node.name)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onChoosePokemon(node.name);
          }
        }}
      >
        <img src={getPokemonSpriteUrl(node.id)} alt={formatPokemonName(node.name)} loading="lazy" />
        <strong>{formatPokemonName(node.name)}</strong>
        <span>{node.requirement}</span>
      </article>
      {node.children.length > 0 && (
        <div className="evolution-children">
          {node.children.map((child) => (
            <EvolutionBranch
              key={`${child.id}-${child.name}`}
              node={child}
              onChoosePokemon={onChoosePokemon}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PokedexPage({ onBack, onOpenTcg, onOpenWhos }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedDex, setSelectedDex] = useState(ALL_POKEDEX_OPTION.id);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [selectedTcgCard, setSelectedTcgCard] = useState(null);
  const [selectedSpriteSet, setSelectedSpriteSet] = useState(null);
  const [selectedPokedexDetail, setSelectedPokedexDetail] = useState(null);
  const [selectedMoveGroup, setSelectedMoveGroup] = useState('');
  const [speciesDetails, setSpeciesDetails] = useState(null);
  const [evolutionTree, setEvolutionTree] = useState(null);
  const [typeWeaknesses, setTypeWeaknesses] = useState([]);
  const [moveDetails, setMoveDetails] = useState({});
  const [tcgCards, setTcgCards] = useState([]);
  const [loadingTcgCards, setLoadingTcgCards] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingPokemon, setLoadingPokemon] = useState(false);
  const [error, setError] = useState('');
  const cryAudioRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    const pokedexIds =
      selectedDex === ALL_POKEDEX_OPTION.id
        ? POKEDEX_OPTIONS.map((pokedex) => pokedex.id)
        : [selectedDex];

    Promise.all(
      pokedexIds.map((pokedexId) =>
        fetch(`${POKEAPI_BASE_URL}/pokedex/${pokedexId}`, { signal: controller.signal })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Unable to load this Pokedex.');
            }
            return response.json();
          }),
      ),
    )
      .then((data) => {
        setPokemonList(buildPokedexEntries(data, selectedDex === ALL_POKEDEX_OPTION.id));
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingList(false);
        }
      });

    return () => controller.abort();
  }, [selectedDex]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/expansions.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load TCG card data.');
        }
        return response.json();
      })
      .then((data) => {
        const allCards = Object.values(data)
          .filter((expansion) => hasPlayableCards(expansion))
          .flatMap((expansion) =>
            [...expansion.commons, ...expansion.uncommons, ...expansion.rares].map((card) => ({
              ...card,
              setName: expansion.setName,
              setId: expansion.setId,
            })),
          );
        setTcgCards(allCards);
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingTcgCards(false);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedPokemon) {
      return undefined;
    }

    const controller = new AbortController();

    Promise.all([
      fetch(selectedPokemon.species.url, { signal: controller.signal }).then((response) => {
        if (!response.ok) throw new Error('Unable to load Pokemon species data.');
        return response.json();
      }),
      Promise.all(
        selectedPokemon.types.map(({ type }) =>
          fetch(type.url, { signal: controller.signal }).then((response) => {
            if (!response.ok) throw new Error('Unable to load Pokemon type data.');
            return response.json();
          }),
        ),
      ),
    ])
      .then(([species, typeData]) => {
        setSpeciesDetails(species);
        setTypeWeaknesses(getTypeWeaknesses(typeData));

        return fetch(species.evolution_chain.url, { signal: controller.signal });
      })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load evolution chain.');
        return response.json();
      })
      .then((data) => {
        setEvolutionTree(buildEvolutionTree(data.chain));
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message);
        }
      });

    return () => controller.abort();
  }, [selectedPokemon]);

  useEffect(
    () => () => {
      if (cryAudioRef.current) {
        cryAudioRef.current.pause();
        cryAudioRef.current = null;
      }
    },
    [selectedPokemon],
  );

  const searchPokemon = useCallback((pokemonName) => {
    const normalizedName = normalizePokemonLookup(pokemonName);
    if (!normalizedName) return;

    setLoadingPokemon(true);
    setError('');

    fetchPokemonByNameOrSpecies(normalizedName)
      .then((data) => {
        setSelectedPokemon(data);
        setSelectedMoveGroup('');
        setSpeciesDetails(null);
        setEvolutionTree(null);
        setTypeWeaknesses([]);
        setMoveDetails({});
        setSelectedPokedexDetail(null);
        setSearchTerm(data.species?.name || data.name);
      })
      .catch((fetchError) => {
        setSelectedPokemon(null);
        setSpeciesDetails(null);
        setEvolutionTree(null);
        setTypeWeaknesses([]);
        setMoveDetails({});
        setSelectedPokedexDetail(null);
        setError(fetchError.message);
      })
      .finally(() => setLoadingPokemon(false));
  }, []);

  const playPokemonCry = useCallback(() => {
    const cryUrl = selectedPokemon?.cries?.latest || selectedPokemon?.cries?.legacy;
    if (!cryUrl) return;

    if (cryAudioRef.current) {
      cryAudioRef.current.pause();
      cryAudioRef.current.currentTime = 0;
    }

    const audio = new Audio(cryUrl);
    cryAudioRef.current = audio;
    audio.play().catch(() => {
      setError('Pokemon cry could not be played.');
    });
  }, [selectedPokemon]);

  const openAbilityDetail = useCallback((ability, isHidden = false) => {
    setSelectedPokedexDetail({
      type: 'ability',
      name: ability.name,
      isHidden,
      loading: true,
      error: '',
      data: null,
    });

    fetch(ability.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load ability details.');
        }
        return response.json();
      })
      .then((data) => {
        setSelectedPokedexDetail({
          type: 'ability',
          name: ability.name,
          isHidden,
          loading: false,
          error: '',
          data,
        });
      })
      .catch((fetchError) => {
        setSelectedPokedexDetail({
          type: 'ability',
          name: ability.name,
          isHidden,
          loading: false,
          error: fetchError.message,
          data: null,
        });
      });
  }, []);

  const openMoveDetail = useCallback((move) => {
    const cachedMove = moveDetails[move.name];

    setSelectedPokedexDetail({
      type: 'move',
      name: move.name,
      level: move.level,
      loading: !cachedMove,
      error: '',
      data: cachedMove || null,
    });

    if (cachedMove) {
      return;
    }

    fetch(move.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load move details.');
        }
        return response.json();
      })
      .then((data) => {
        setSelectedPokedexDetail({
          type: 'move',
          name: move.name,
          level: move.level,
          loading: false,
          error: '',
          data,
        });
      })
      .catch((fetchError) => {
        setSelectedPokedexDetail({
          type: 'move',
          name: move.name,
          level: move.level,
          loading: false,
          error: fetchError.message,
          data: null,
        });
      });
  }, [moveDetails]);

  const searchRandomPokemon = useCallback(() => {
    setError('');
    setLoadingPokemon(true);

    const loadAllPokemon =
      selectedDex === ALL_POKEDEX_OPTION.id && pokemonList.length
        ? Promise.resolve(pokemonList)
        : Promise.all(
            POKEDEX_OPTIONS.map((pokedex) =>
              fetch(`${POKEAPI_BASE_URL}/pokedex/${pokedex.id}`)
                .then((response) => {
                  if (!response.ok) {
                    throw new Error('Unable to load all Pokedex entries.');
                  }
                  return response.json();
                }),
            ),
          ).then((data) => buildPokedexEntries(data, true));

    loadAllPokemon
      .then((entries) => {
        const randomPokemon = randomItem(entries);
        if (!randomPokemon) {
          throw new Error('No Pokemon available to randomize.');
        }
        return fetchPokemonByNameOrSpecies(randomPokemon.name);
      })
      .then((data) => {
        setSelectedPokemon(data);
        setSelectedMoveGroup('');
        setSpeciesDetails(null);
        setEvolutionTree(null);
        setTypeWeaknesses([]);
        setMoveDetails({});
        setSelectedPokedexDetail(null);
        setSearchTerm(data.species?.name || data.name);
      })
      .catch((fetchError) => {
        setSelectedPokemon(null);
        setSpeciesDetails(null);
        setEvolutionTree(null);
        setTypeWeaknesses([]);
        setMoveDetails({});
        setSelectedPokedexDetail(null);
        setError(fetchError.message);
      })
      .finally(() => setLoadingPokemon(false));
  }, [pokemonList, selectedDex]);

  const visiblePokemon = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return pokemonList;

    return pokemonList
      .filter((pokemon) => (
        pokemon.name.includes(normalizedSearch) ||
        String(pokemon.entryNumber).includes(normalizedSearch)
      ));
  }, [pokemonList, searchTerm]);

  const pokedexChoices = [ALL_POKEDEX_OPTION, ...POKEDEX_OPTIONS];
  const activeDex = pokedexChoices.find((pokedex) => pokedex.id === selectedDex);
  const regionalPokemonCount = pokemonList.length;

  const officialArtwork =
    selectedPokemon?.sprites?.other?.['official-artwork']?.front_default ||
    selectedPokemon?.sprites?.front_default;
  const moveVersionGroups = useMemo(
    () => getAvailableLevelUpMoveGroups(selectedPokemon),
    [selectedPokemon],
  );
  const activeMoveGroup = selectedMoveGroup || moveVersionGroups[0] || '';
  const levelUpMoves = useMemo(
    () => getLevelUpMovesForVersionGroup(selectedPokemon, activeMoveGroup),
    [selectedPokemon, activeMoveGroup],
  );
  useEffect(() => {
    if (!levelUpMoves.length) {
      return undefined;
    }

    const controller = new AbortController();

    Promise.all(
      levelUpMoves.map((move) =>
        fetch(move.url, { signal: controller.signal })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Unable to load move details.');
            }
            return response.json();
          })
          .then((data) => [move.name, data]),
      ),
    )
      .then((entries) => {
        setMoveDetails(Object.fromEntries(entries));
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message);
        }
      });

    return () => controller.abort();
  }, [levelUpMoves]);
  const generationSprites = useMemo(
    () => getGenerationSprites(selectedPokemon),
    [selectedPokemon],
  );
  const alternateForms = useMemo(
    () =>
      (speciesDetails?.varieties || []).map((variety) => ({
        name: variety.pokemon.name,
        isDefault: variety.is_default,
        pokemonId: getPokemonIdFromPokemonUrl(variety.pokemon.url),
      })),
    [speciesDetails],
  );
  const featuredCards = useMemo(
    () => getFeaturedTcgCards(tcgCards, [selectedPokemon?.name, selectedPokemon?.species?.name]),
    [tcgCards, selectedPokemon],
  );
  const getStarterName = useCallback(
    (starterId) =>
      pokemonList.find((pokemon) => pokemon.pokemonId === String(starterId))?.name ||
      `Pokemon ${starterId}`,
    [pokemonList],
  );

  return (
    <div className="app-container pokedex-page">
      <header className="app-header">
        <button type="button" className="brand-mark brand-home-button" onClick={onBack}>
          <span className="nes-pokeball brand-pokeball" aria-hidden="true" />
          <h1>Pokedex</h1>
        </button>
        <div className="header-actions">
          <button type="button" className="nes-btn nav-button" onClick={onBack}>
            Home
          </button>
          <button type="button" className="nes-btn nav-button" onClick={onOpenTcg}>
            TCG
          </button>
          <button type="button" className="nes-btn nav-button" onClick={onOpenWhos}>
            Who's That?
          </button>
          <GitHubRepoLink />
        </div>
      </header>

      <section className="pokedex-layout">
        <form
          className="pokedex-search-panel"
          onSubmit={(event) => {
            event.preventDefault();
            searchPokemon(searchTerm);
          }}
        >
          <label>Game Pokedex</label>
          <div className="pokedex-game-picker">
            <div className="pokedex-game-grid" aria-label="Game Pokedex">
              {pokedexChoices.map((pokedex) => (
                <button
                  key={pokedex.id}
                  type="button"
                  className={`pokedex-game-card nes-btn ${
                    selectedDex === pokedex.id ? 'is-primary is-selected' : ''
                  }`}
                  onClick={() => {
                    setSelectedDex(pokedex.id);
                    setSearchTerm('');
                    setError('');
                    setPokemonList([]);
                    setSelectedPokemon(null);
                    setSpeciesDetails(null);
                    setEvolutionTree(null);
                    setTypeWeaknesses([]);
                    setMoveDetails({});
                    setSelectedSpriteSet(null);
                    setSelectedPokedexDetail(null);
                    setSelectedMoveGroup('');
                    setLoadingList(true);
                  }}
                  disabled={loadingList && selectedDex === pokedex.id}
                >
                  {pokedex.starters?.length > 0 && (
                    <span className="starter-sprite-row" aria-hidden="true">
                      {pokedex.starters.map((starterId) => (
                        <img
                          key={starterId}
                          src={getPokemonSpriteUrl(starterId)}
                          alt=""
                          loading="lazy"
                        />
                      ))}
                    </span>
                  )}
                  <strong>{pokedex.label}</strong>
                  <span className="pokedex-game-region">{pokedex.region}</span>
                </button>
              ))}
            </div>
          </div>

          <label htmlFor="pokemon-search">Search Pokemon</label>
          <div className="pokedex-search-row">
            <input
              id="pokemon-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Name or number..."
            />
            <button type="submit" className="nes-btn is-success" disabled={loadingPokemon}>
              Search
            </button>
            <button
              type="button"
              className="nes-btn is-error"
              onClick={searchRandomPokemon}
              disabled={loadingPokemon}
            >
              Random
            </button>
            <button
              type="button"
              className="nes-btn"
              onClick={() => {
                setSearchTerm('');
                setSelectedPokemon(null);
                setSpeciesDetails(null);
                setEvolutionTree(null);
                setTypeWeaknesses([]);
                setMoveDetails({});
                setSelectedSpriteSet(null);
                setSelectedMoveGroup('');
              }}
              disabled={!searchTerm && !selectedPokemon}
            >
              Clear
            </button>
          </div>

          {error && <p className="pokedex-error">{error}</p>}

          <div className="pokemon-list" aria-label="Pokemon quick picks">
            {loadingList && <p>Loading Pokemon...</p>}
            {visiblePokemon.map((pokemon) => (
              <button
                key={pokemon.name}
                type="button"
                className="pokemon-list-item nes-btn"
                onClick={() => searchPokemon(pokemon.name)}
              >
                <span>#{String(pokemon.entryNumber).padStart(3, '0')}</span>
                <img
                  src={getPokemonSpriteUrl(pokemon.pokemonId)}
                  alt=""
                  loading="lazy"
                  aria-hidden="true"
                />
                <strong>{formatPokemonName(pokemon.name)}</strong>
              </button>
            ))}
            {!loadingList && !visiblePokemon.length && (
              <p>No Pokemon match this Pokedex search.</p>
            )}
          </div>

          {selectedPokemon && (
            <section className="pokedex-section generation-sprites-section is-left-column">
              <h3>Generation Sprites</h3>
              <div className="generation-sprite-grid">
                {generationSprites.map((sprite) => (
                  <article
                    key={sprite.id}
                    className="generation-sprite-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedSpriteSet(sprite)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedSpriteSet(sprite);
                      }
                    }}
                  >
                    <img src={sprite.image} alt={`${selectedPokemon.name} ${sprite.game} sprite`} />
                    <strong>{sprite.generation}</strong>
                    <span>{sprite.game}</span>
                  </article>
                ))}
              </div>
            </section>
          )}

        </form>

        <article className="pokedex-card">
          {loadingPokemon && <p className="pokedex-status">Scanning...</p>}
          {!loadingPokemon && selectedPokemon && (
            <>
              <div className="pokedex-card-media">
                {officialArtwork && <img src={officialArtwork} alt={selectedPokemon.name} />}
              </div>
              <div className="pokedex-card-info">
                <p className="card-detail-set">#{String(selectedPokemon.id).padStart(3, '0')}</p>
                <div className="pokemon-title-row">
                  <h2>{formatPokemonName(selectedPokemon.name)}</h2>
                  <button
                    type="button"
                    className="cry-button"
                    onClick={playPokemonCry}
                    disabled={!selectedPokemon.cries?.latest && !selectedPokemon.cries?.legacy}
                    aria-label={`Play ${formatPokemonName(selectedPokemon.name)} cry`}
                  >
                    <img src={speakerIcon} alt="" aria-hidden="true" />
                  </button>
                </div>
                <div className="type-row">
                  {selectedPokemon.types.map(({ type }) => (
                    <span key={type.name} className={`type-badge type-${type.name}`}>
                      <img src={TYPE_ICONS[type.name]} alt="" aria-hidden="true" />
                      {type.name}
                    </span>
                  ))}
                </div>
                {speciesDetails && (
                  <section className="pokedex-section flavor-section">
                    <p>{getEnglishFlavorText(speciesDetails) || 'No English flavor text found.'}</p>
                  </section>
                )}
                <section className="pokedex-section weakness-section">
                  <h3>Weak To</h3>
                  <div className="type-row">
                    {typeWeaknesses.map((weakness) => (
                      <span key={weakness.name} className={`type-badge type-${weakness.name}`}>
                        <img src={TYPE_ICONS[weakness.name]} alt="" aria-hidden="true" />
                        {weakness.name} x{weakness.multiplier}
                      </span>
                    ))}
                    {!typeWeaknesses.length && <p>No weaknesses found.</p>}
                  </div>
                </section>
                <section className="pokedex-section">
                  <h3>Profile</h3>
                  <dl className="profile-list">
                    <div>
                      <dt>Species</dt>
                      <dd>
                        {speciesDetails?.genera?.find((genus) => genus.language.name === 'en')?.genus ||
                          'Loading...'}
                      </dd>
                    </div>
                    <div>
                      <dt>Height</dt>
                      <dd>{selectedPokemon.height / 10} m</dd>
                    </div>
                    <div>
                      <dt>Weight</dt>
                      <dd>{selectedPokemon.weight / 10} kg</dd>
                    </div>
                  </dl>
                </section>

                <section className="pokedex-section">
                  <h3>Base Stats</h3>
                  <div className="base-stat-list">
                    {selectedPokemon.stats.map((stat) => (
                      <div key={stat.stat.name} className="base-stat-row">
                        <span>{STAT_LABELS[stat.stat.name] || formatPokemonName(stat.stat.name)}</span>
                        <meter min="0" max="255" value={stat.base_stat} />
                        <strong>{stat.base_stat}</strong>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="pokedex-section">
                  <h3>Abilities</h3>
                  <div className="ability-list">
                    {selectedPokemon.abilities.map(({ ability, is_hidden: isHidden }) => (
                      <button
                        key={ability.name}
                        type="button"
                        className="ability-button"
                        onClick={() => openAbilityDetail(ability, isHidden)}
                      >
                        {formatPokemonName(ability.name)}
                        {isHidden ? ' (Hidden)' : ''}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <section className="pokedex-section evolution-section">
                <h3>Evolution Tree</h3>
                <div className="evolution-tree">
                  {evolutionTree ? (
                    <EvolutionBranch node={evolutionTree} onChoosePokemon={searchPokemon} />
                  ) : (
                    <p className="pokedex-status">Loading evolution tree...</p>
                  )}
                </div>
              </section>

              {alternateForms.length > 1 && (
                <section className="pokedex-section alternate-forms-section">
                  <h3>Alternate Forms</h3>
                  <div className="alternate-form-grid">
                    {alternateForms.map((form) => (
                      <button
                        key={form.name}
                        type="button"
                        className={`alternate-form-card ${
                          selectedPokemon.name === form.name ? 'is-current' : ''
                        }`}
                        onClick={() => searchPokemon(form.name)}
                      >
                        <img
                          src={getPokemonOfficialArtworkUrl(form.pokemonId)}
                          alt=""
                          loading="lazy"
                          aria-hidden="true"
                          onError={(event) => {
                            event.currentTarget.src = getPokemonSpriteUrl(form.pokemonId);
                          }}
                        />
                        <strong>{formatPokemonName(form.name)}</strong>
                        {form.isDefault && <span>Default Form</span>}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section className="pokedex-section moves-section">
                <h3>
                  Level-Up Moves
                  {activeMoveGroup && (
                    <span>{formatVersionGroupName(activeMoveGroup)}</span>
                  )}
                </h3>
                <div className="move-version-grid" aria-label="Level-up move version">
                  {moveVersionGroups.map((versionGroup) => (
                    <button
                      key={versionGroup}
                      type="button"
                      className={`move-version-button nes-btn ${
                        activeMoveGroup === versionGroup ? 'is-error is-selected' : ''
                      }`}
                      onClick={() => setSelectedMoveGroup(versionGroup)}
                    >
                      {formatVersionGroupName(versionGroup)}
                    </button>
                  ))}
                </div>
                <div className="moves-table-wrap">
                  <table className="moves-table">
                    <thead>
                      <tr>
                        <th>Lv.</th>
                        <th>Move</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Power</th>
                        <th>Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {levelUpMoves.map((move, index) => (
                        <tr
                          key={`${move.level}-${move.name}`}
                          className={`move-detail-row ${index % 2 ? 'is-red-row' : ''}`}
                          role="button"
                          tabIndex={0}
                          onClick={() => openMoveDetail(move)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              openMoveDetail(move);
                            }
                          }}
                        >
                          {moveDetails[move.name] ? (
                            <>
                              <td>{move.level}</td>
                              <td>{formatPokemonName(move.name)}</td>
                              <td>
                                <span className={`move-type-pill type-${moveDetails[move.name].type.name}`}>
                                  {formatPokemonName(moveDetails[move.name].type.name)}
                                </span>
                              </td>
                              <td>
                                <img
                                  className="move-category-icon"
                                  src={MOVE_CATEGORY_ICONS[moveDetails[move.name].damage_class.name]}
                                  alt={formatPokemonName(moveDetails[move.name].damage_class.name)}
                                  title={formatPokemonName(moveDetails[move.name].damage_class.name)}
                                />
                              </td>
                              <td>{moveDetails[move.name].power || '-'}</td>
                              <td>{moveDetails[move.name].accuracy || '-'}</td>
                            </>
                          ) : (
                            <>
                              <td>{move.level}</td>
                              <td>{formatPokemonName(move.name)}</td>
                              <td colSpan="4">Loading...</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!levelUpMoves.length && (
                    <p className="pokedex-status">No level-up moves found for this game.</p>
                  )}
                </div>
              </section>

            </>
          )}
          {!loadingPokemon && !selectedPokemon && (
            <div className="pokedex-empty-state">
              <p className="pokedex-status">
                Choose a Pokemon from {activeDex?.label || 'this Pokedex'} to inspect its data.
              </p>
              {activeDex && activeDex.id !== ALL_POKEDEX_OPTION.id && (
                <aside className="pokedex-game-preview" aria-label={`${activeDex.label} details`}>
                  <div className="pokedex-game-preview-copy">
                    <strong>{activeDex.label}</strong>
                    <span>Region: {activeDex.region}</span>
                    <span>Pokemon: {regionalPokemonCount}</span>
                    <span>Released: {activeDex.releaseDate}</span>
                    <span>Director: {activeDex.director}</span>
                  </div>
                  {activeDex.art.length > 0 && (
                    <div className="pokedex-game-preview-art" aria-hidden="true">
                      {activeDex.art.map((artSrc) => (
                        <img key={artSrc} src={artSrc} alt="" loading="lazy" />
                      ))}
                    </div>
                  )}
                </aside>
              )}
              {activeDex && activeDex.id !== ALL_POKEDEX_OPTION.id && (
                <div className="pokedex-preview-bottom">
                  {activeDex.starters?.length > 0 && (
                    <aside className="pokedex-starter-preview" aria-label={`${activeDex.region} starters`}>
                      <strong>{activeDex.region} Starters</strong>
                      <div className="starter-art-row">
                        {activeDex.starters.map((starterId) => (
                          <span
                            key={starterId}
                            className="starter-art-button"
                            role="button"
                            tabIndex={0}
                            onClick={() => searchPokemon(String(starterId))}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                searchPokemon(String(starterId));
                              }
                            }}
                          >
                            <img
                              src={getPokemonOfficialArtworkUrl(starterId)}
                              alt={`Open ${formatPokemonName(getStarterName(starterId))}`}
                              loading="lazy"
                            />
                            <strong>{formatPokemonName(getStarterName(starterId))}</strong>
                          </span>
                        ))}
                      </div>
                    </aside>
                  )}
                  <aside className="pokedex-platform-preview">
                    <strong>Platform</strong>
                    <div className="platform-list" aria-label="Platforms">
                      {activeDex.platforms.map((platform) => (
                        <span key={platform.name} title={platform.name}>
                          <img src={platform.icon} alt={platform.name} loading="lazy" />
                        </span>
                      ))}
                    </div>
                  </aside>
                </div>
              )}
            </div>
          )}
        </article>
      </section>

      {selectedPokemon && (
        <section className="pokedex-section tcg-featured-section is-full-width">
          <h3>Featured TCG Cards</h3>
          {loadingTcgCards && <p className="pokedex-status">Loading TCG cards...</p>}
          {!loadingTcgCards && (
            <div className="tcg-featured-grid">
              {featuredCards.map((card) => (
                <article
                  key={`${card.setId}-${card.id}`}
                  className="binder-card is-owned"
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedTcgCard(card)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedTcgCard(card);
                    }
                  }}
                >
                  <img
                    src={getCardFaceImage(card)}
                    data-fallback-src={getCardFallbackImage(card)}
                    alt={card.name}
                    loading="lazy"
                    onError={handleCardImageError}
                  />
                  <div>
                    <h3>{card.name}</h3>
                    <p>{card.setName}</p>
                  </div>
                </article>
              ))}
              {!featuredCards.length && (
                <p className="pokedex-status">No local TCG cards found for this Pokemon.</p>
              )}
            </div>
          )}
        </section>
      )}

      {selectedSpriteSet && (
        <div
          className="sprite-detail-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sprite-detail-title"
          onClick={() => setSelectedSpriteSet(null)}
        >
          <div className="sprite-detail-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close nes-btn"
              onClick={() => setSelectedSpriteSet(null)}
              aria-label="Close sprite details"
            >
              Close
            </button>
            <div>
              <p className="card-detail-set">{selectedSpriteSet.generation}</p>
              <h2 id="sprite-detail-title">{selectedSpriteSet.game} Sprites</h2>
            </div>
            <div className="sprite-variant-grid">
              {selectedSpriteSet.variants.map((variant) => (
                <article key={variant.label} className="sprite-variant-card">
                  <img src={variant.image} alt={`${selectedSpriteSet.game} ${variant.label}`} />
                  <strong>{variant.label}</strong>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedPokedexDetail && (
        <div
          className="pokedex-info-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pokedex-info-title"
          onClick={() => setSelectedPokedexDetail(null)}
        >
          <div className="pokedex-info-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close nes-btn"
              onClick={() => setSelectedPokedexDetail(null)}
              aria-label="Close Pokedex detail"
            >
              Close
            </button>
            <div>
              <p className="card-detail-set">
                {selectedPokedexDetail.type === 'ability' ? 'Ability' : 'Move'}
              </p>
              <h2 id="pokedex-info-title">{formatPokemonName(selectedPokedexDetail.name)}</h2>
            </div>

            {selectedPokedexDetail.loading && (
              <p className="pokedex-status">Loading details...</p>
            )}
            {!selectedPokedexDetail.loading && selectedPokedexDetail.error && (
              <p className="pokedex-status">{selectedPokedexDetail.error}</p>
            )}
            {!selectedPokedexDetail.loading && selectedPokedexDetail.data && (
              <>
                {selectedPokedexDetail.type === 'ability' && (
                  <>
                    <dl className="pokedex-info-meta">
                      <div>
                        <dt>Slot</dt>
                        <dd>{selectedPokedexDetail.isHidden ? 'Hidden Ability' : 'Standard Ability'}</dd>
                      </div>
                      <div>
                        <dt>Introduced</dt>
                        <dd>{formatGenerationName(selectedPokedexDetail.data.generation?.name) || 'Unknown'}</dd>
                      </div>
                    </dl>
                    <section className="detail-section">
                      <h3>Effect</h3>
                      <p>
                        {getEnglishEffectText(selectedPokedexDetail.data.effect_entries) ||
                          'No English effect text found.'}
                      </p>
                    </section>
                    <section className="detail-section">
                      <h3>Game Description</h3>
                      <p>
                        {getEnglishApiFlavorText(selectedPokedexDetail.data.flavor_text_entries) ||
                          'No English game description found.'}
                      </p>
                    </section>
                  </>
                )}

                {selectedPokedexDetail.type === 'move' && (
                  <>
                    <dl className="pokedex-info-meta">
                      <div>
                        <dt>Level</dt>
                        <dd>{selectedPokedexDetail.level}</dd>
                      </div>
                      <div>
                        <dt>Type</dt>
                        <dd>
                          <span className={`move-type-pill type-${selectedPokedexDetail.data.type.name}`}>
                            {formatPokemonName(selectedPokedexDetail.data.type.name)}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt>Category</dt>
                        <dd>
                          <img
                            className="move-category-icon"
                            src={MOVE_CATEGORY_ICONS[selectedPokedexDetail.data.damage_class.name]}
                            alt={formatPokemonName(selectedPokedexDetail.data.damage_class.name)}
                          />
                        </dd>
                      </div>
                      <div>
                        <dt>Power</dt>
                        <dd>{selectedPokedexDetail.data.power ?? '-'}</dd>
                      </div>
                      <div>
                        <dt>Accuracy</dt>
                        <dd>{selectedPokedexDetail.data.accuracy ?? '-'}</dd>
                      </div>
                      <div>
                        <dt>PP</dt>
                        <dd>{selectedPokedexDetail.data.pp ?? '-'}</dd>
                      </div>
                      <div>
                        <dt>Introduced</dt>
                        <dd>{formatGenerationName(selectedPokedexDetail.data.generation?.name) || 'Unknown'}</dd>
                      </div>
                    </dl>
                    <section className="detail-section">
                      <h3>Effect</h3>
                      <p>
                        {getEnglishEffectText(selectedPokedexDetail.data.effect_entries) ||
                          getEnglishShortEffectText(selectedPokedexDetail.data.effect_entries) ||
                          'No English effect text found.'}
                      </p>
                    </section>
                    <section className="detail-section">
                      <h3>Game Description</h3>
                      <p>
                        {getEnglishApiFlavorText(selectedPokedexDetail.data.flavor_text_entries) ||
                          'No English game description found.'}
                      </p>
                    </section>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {selectedTcgCard && (
        <div
          className="card-detail-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pokedex-tcg-card-detail-title"
          onClick={() => setSelectedTcgCard(null)}
        >
          <div className="card-detail-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close nes-btn"
              onClick={() => setSelectedTcgCard(null)}
              aria-label="Close card details"
            >
              Close
            </button>
            <div
              className="card-detail-image-wrap"
              onPointerMove={(event) => {
                const card = event.currentTarget;
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                card.style.setProperty('--pointer-x', `${x * 100}%`);
                card.style.setProperty('--pointer-y', `${y * 100}%`);
                card.style.setProperty('--rotate-x', `${(0.5 - y) * 24}deg`);
                card.style.setProperty('--rotate-y', `${(x - 0.5) * 24}deg`);
                card.style.setProperty('--card-shift-x', `${(x - 0.5) * 10}px`);
                card.style.setProperty('--card-shift-y', `${(y - 0.5) * 10}px`);
              }}
              onPointerLeave={(event) => {
                const card = event.currentTarget;
                card.style.setProperty('--pointer-x', '50%');
                card.style.setProperty('--pointer-y', '50%');
                card.style.setProperty('--rotate-x', '0deg');
                card.style.setProperty('--rotate-y', '0deg');
                card.style.setProperty('--card-shift-x', '0px');
                card.style.setProperty('--card-shift-y', '0px');
              }}
            >
              <img
                src={getCardFaceImage(selectedTcgCard)}
                data-fallback-src={getCardFallbackImage(selectedTcgCard)}
                alt={selectedTcgCard.name}
                onError={handleCardImageError}
              />
              {selectedTcgCard.isRare && <div className="holo-overlay" aria-hidden="true" />}
            </div>
            <div className="card-detail-info">
              <p className="card-detail-set">{selectedTcgCard.setName}</p>
              <h2 id="pokedex-tcg-card-detail-title">{selectedTcgCard.name}</h2>
              <dl className="card-detail-meta">
                <div>
                  <dt>Rarity</dt>
                  <dd>{selectedTcgCard.rarity || 'Unknown'}</dd>
                </div>
                <div>
                  <dt>Number</dt>
                  <dd>{selectedTcgCard.number || 'N/A'}</dd>
                </div>
                <div>
                  <dt>HP</dt>
                  <dd>{selectedTcgCard.hp || 'N/A'}</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{selectedTcgCard.types?.join(', ') || 'N/A'}</dd>
                </div>
                <div>
                  <dt>Stage</dt>
                  <dd>
                    {selectedTcgCard.subtypes?.join(', ') ||
                      selectedTcgCard.supertype ||
                      'N/A'}
                  </dd>
                </div>
                <div>
                  <dt>Artist</dt>
                  <dd>{selectedTcgCard.artist || 'Unknown'}</dd>
                </div>
              </dl>
              {selectedTcgCard.evolvesFrom && (
                <p className="detail-copy">Evolves from {selectedTcgCard.evolvesFrom}</p>
              )}
              {selectedTcgCard.flavorText && (
                <p className="detail-copy">{selectedTcgCard.flavorText}</p>
              )}
              {selectedTcgCard.abilities?.length > 0 && (
                <section className="detail-section">
                  <h3>Abilities</h3>
                  {selectedTcgCard.abilities.map((ability) => (
                    <article key={`${ability.name}-${ability.type}`}>
                      <strong>{ability.name}</strong>
                      <p>{ability.text}</p>
                    </article>
                  ))}
                </section>
              )}
              {selectedTcgCard.attacks?.length > 0 && (
                <section className="detail-section">
                  <h3>Attacks</h3>
                  {selectedTcgCard.attacks.map((attack) => (
                    <article key={`${attack.name}-${attack.damage}`}>
                      <strong>
                        {attack.name} {attack.damage && `- ${attack.damage}`}
                      </strong>
                      <p>{attack.text || 'No attack text.'}</p>
                    </article>
                  ))}
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [activeView, setActiveView] = useState('home');

  if (activeView === 'pokedex') {
    return (
      <PokedexPage
        onBack={() => setActiveView('home')}
        onOpenTcg={() => setActiveView('tcg')}
        onOpenWhos={() => setActiveView('who')}
      />
    );
  }

  if (activeView === 'tcg') {
    return (
      <TcgSimulator
        onBack={() => setActiveView('home')}
        onOpenPokedex={() => setActiveView('pokedex')}
        onOpenWhos={() => setActiveView('who')}
      />
    );
  }

  if (activeView === 'who') {
    return (
      <WhosThatPokemonPage
        onBack={() => setActiveView('home')}
        onOpenPokedex={() => setActiveView('pokedex')}
        onOpenTcg={() => setActiveView('tcg')}
      />
    );
  }

  return <HomePage onChoose={setActiveView} />;
}

export default App;
