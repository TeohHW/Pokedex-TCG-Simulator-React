import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';

const COLLECTION_STORAGE_KEY = 'pokemon-pack-simulator-collection';
const CARD_FLIP_DELAY = 300;
const PACK_PREP_DELAY = 900;
const TEN_PACK_FLIP_DELAY = CARD_FLIP_DELAY / 10;
const CARD_BACK_IMAGE = 'https://images.pokemontcg.io/unbroken-bond/back.png';
const REPOSITORY_URL = 'https://github.com/TeohHW/Pokemon-TCG-Simulator-React';
const POKEBALL_LOGO = new URL(
  '../pokemon-tcg-data-master/images/Poké_Ball_icon.png',
  import.meta.url,
).href;

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

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

function App() {
  const [allExpansions, setAllExpansions] = useState(null);
  const [selectedSet, setSelectedSet] = useState('base1');
  const [selectedSeries, setSelectedSeries] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState('release-oldest');
  const [currentPack, setCurrentPack] = useState([]);
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

  const hasPlayableCards = (expansion) =>
    Boolean(
      expansion?.commons?.length &&
        expansion?.uncommons?.length &&
        expansion?.rares?.length,
    );

  useEffect(() => {
    document.documentElement.dataset.theme = 'dark';
  }, []);

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
    setCurrentPack(cards);
    setShowPackModal(true);
    setPackAdded(false);
    setIsPreparingPack(false);
    setIsAutoRevealing(false);
    setSelectedCard(null);
    revealDelayRef.current = revealDelay;
    revealCards(cards, revealDelay);
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

  const addCurrentPackToBinder = () => {
    addPackToBinder(currentPack);
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
  const activeSetCards = activeSet
    ? [...activeSet.commons, ...activeSet.uncommons, ...activeSet.rares]
    : [];
  const ownedActiveSetCards = activeSetCards.filter((card) => collection[card.id]);
  const binderProgress = activeSetCards.length
    ? Math.round((ownedActiveSetCards.length / activeSetCards.length) * 100)
    : 0;
  const progressLevel = binderProgress >= 75 ? 'good' : binderProgress >= 35 ? 'mid' : 'low';
  const packCanBeAdded =
    currentPack.length > 0 &&
    currentPack.every((card) => card.flipped) &&
    !isAutoRevealing;

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
        <div className="brand-mark">
          <img src={POKEBALL_LOGO} alt="" aria-hidden="true" />
          <h1>Pokémon TCG Simulator</h1>
        </div>
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
              className={`set-card ${selectedSet === key ? 'is-selected' : ''}`}
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
            className="btn btn-primary"
          >
            {loading ? 'Loading Database...' : 'Open 1 Pack'}
          </button>
          <button
            onClick={openTenPacks}
            disabled={loading || !selectedSetIsPlayable}
            className="btn btn-secondary btn-ten-pack"
          >
            Open 10 Packs
          </button>
          <button
            onClick={openGodPack}
            disabled={loading || !selectedSetIsPlayable}
            className="btn btn-god"
          >
            Open God Pack
          </button>
          <button
            onClick={clearBinder}
            disabled={!Object.keys(collection).length}
            className="btn btn-danger"
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
        <div className="binder-grid">
          {activeSetCards.map((card) => {
            const ownedCard = collection[card.id];
            return (
              <article
                key={card.id}
                className={`binder-card ${ownedCard ? 'is-owned' : ''}`}
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
              <button type="button" onClick={() => setShowClearBinderDialog(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmClearBinder}>
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
                {activeSet?.logo && (
                  <img
                    className="pack-set-logo"
                    src={activeSet.logo}
                    alt={`${activeSet.setName} logo`}
                  />
                )}
                <span className="pack-release-year">
                  Release Year: {activeSet?.releaseYear || 'Unknown year'}
                </span>
              </div>
              <button
                type="button"
                className="modal-close"
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
              <>
                <div className="pack-grid">
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

                <div className="pack-actions">
                  <button
                    onClick={addCurrentPackToBinder}
                    disabled={!packCanBeAdded || packAdded}
                    className="btn btn-secondary"
                  >
                    {packAdded ? 'Pack Added to Binder' : 'Add Pack to Binder'}
                  </button>
                </div>
              </>
            )}
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
              className="modal-close"
              onClick={() => setSelectedCard(null)}
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

export default App;
