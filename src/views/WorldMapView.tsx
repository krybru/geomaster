import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  MapPin,
  Globe,
  Layers,
  Compass,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Target,
  Sparkles,
  HelpCircle,
  Check,
} from 'lucide-react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import countriesData from 'world-atlas/countries-110m.json';
import { db, recordAnswer, type Country } from '../db';

type MapViewMode = 'explore' | 'tasks';
type TaskType = 'locate' | 'neighbors';

export const WorldMapView: React.FC = () => {
  const [viewMode, setViewMode] = useState<MapViewMode>('explore');
  const [taskType, setTaskType] = useState<TaskType>('locate');

  const [features, setFeatures] = useState<any[]>([]);
  const [selectedGeo, setSelectedGeo] = useState<any | null>(null);
  const [hoveredGeo, setHoveredGeo] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Map Tasks state
  const [taskTarget, setTaskTarget] = useState<Country | null>(null);
  const [taskSubmitted, setTaskSubmitted] = useState(false);
  const [taskIsCorrect, setTaskIsCorrect] = useState(false);
  const [clickedCountry, setClickedCountry] = useState<Country | null>(null);

  // Neighbors task state
  const [selectedNeighborIsos, setSelectedNeighborIsos] = useState<string[]>([]);
  const [neighborResult, setNeighborResult] = useState<{
    correct: string[];
    missed: string[];
    wrong: string[];
    isFullSuccess: boolean;
  } | null>(null);

  // Mouse drag & panning state refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const dragDistanceRef = useRef(0);
  const [isCursorDragging, setIsCursorDragging] = useState(false);

  const taskStartTimeRef = useRef<number>(Date.now());
  const allCountries = useLiveQuery(() => db.countries.toArray());

  // Mappings for fast lookups
  const { numericMap, isoMap, nameMap } = useMemo(() => {
    const numMap = new Map<string, Country>();
    const iMap = new Map<string, Country>();
    const nMap = new Map<string, Country>();

    allCountries?.forEach((c) => {
      numMap.set(c.isoNumeric, c);
      numMap.set(c.isoNumeric.replace(/^0+/, ''), c);
      iMap.set(c.iso2, c);
      nMap.set(c.nameEn.toLowerCase(), c);
      nMap.set(c.namePl.toLowerCase(), c);
    });

    return { numericMap: numMap, isoMap: iMap, nameMap: nMap };
  }, [allCountries]);

  const width = 1000;
  const height = 550;

  useEffect(() => {
    try {
      const countriesGeo = feature(
        countriesData as any,
        (countriesData as any).objects.countries
      ) as any;
      if (countriesGeo && countriesGeo.features) {
        setFeatures(countriesGeo.features);
      }
    } catch (e) {
      console.error('Error loading world map data:', e);
    }
  }, []);

  // Smooth wheel zoom with non-passive event listener to prevent window scrolling
  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 0.87;
      setZoom((z) => {
        const next = Math.min(Math.max(z * factor, 0.75), 8);
        return Number(next.toFixed(3));
      });
    };

    el.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleNativeWheel);
  }, []);

  // Memoized D3 projection & pathGenerator (only updates when zoom or pan actually changes)
  const projection = useMemo(() => {
    return geoNaturalEarth1()
      .scale(160 * zoom)
      .translate([width / 2 + pan.x, height / 2 + pan.y]);
  }, [zoom, pan.x, pan.y, width, height]);

  const pathGenerator = useMemo(() => {
    return geoPath().projection(projection);
  }, [projection]);

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.3, 8));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.3, 0.75));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedGeo(null);
  };

  // Helper to find country from geometry
  const getCountryFromGeo = useCallback(
    (geo: any): Country | null => {
      if (!geo) return null;
      const geoId = String(geo.id || '');
      const geoName = String(geo.properties?.name || '').toLowerCase();
      return (
        numericMap.get(geoId) ||
        numericMap.get(geoId.replace(/^0+/, '')) ||
        nameMap.get(geoName) ||
        null
      );
    },
    [numericMap, nameMap]
  );

  // Precomputed paths for all features (crucial: avoids 177 path recalculations on every hover!)
  const renderedFeatures = useMemo(() => {
    return features.map((geo, index) => ({
      geo,
      id: geo.id ?? index,
      d: pathGenerator(geo) || '',
      country: getCountryFromGeo(geo),
    }));
  }, [features, pathGenerator, getCountryFromGeo]);

  // Selected country in explore mode (only changes when clicked!)
  const selectedCountry: Country | null = useMemo(() => {
    return getCountryFromGeo(selectedGeo);
  }, [selectedGeo, getCountryFromGeo]);

  // Hovered country for floating tooltip (does not affect layout or sidebar)
  const hoveredCountry: Country | null = useMemo(() => {
    return getCountryFromGeo(hoveredGeo);
  }, [hoveredGeo, getCountryFromGeo]);

  // Click on a neighbor to select and highlight on map
  const handleSelectNeighbor = (neighborIso: string) => {
    const country = isoMap.get(neighborIso);
    if (!country) return;

    const matchingFeature = features.find((f) => {
      const c = getCountryFromGeo(f);
      return c?.iso2 === neighborIso;
    });

    if (matchingFeature) {
      setSelectedGeo(matchingFeature);
    }
  };

  // Generate new task
  const initNextTask = useCallback(() => {
    if (!allCountries || allCountries.length === 0) return;

    // Filter countries that actually exist in the 110m map
    const validCountries = allCountries.filter((c) => {
      const num = c.isoNumeric;
      return features.some((f) => {
        const id = String(f.id);
        return id === num || id === num.replace(/^0+/, '');
      });
    });

    if (validCountries.length === 0) return;

    let eligible = validCountries;
    if (taskType === 'neighbors') {
      const withNeighbors = validCountries.filter((c) => c.neighbors && c.neighbors.length > 0);
      if (withNeighbors.length > 0) eligible = withNeighbors;
    }

    const picked = eligible[Math.floor(Math.random() * eligible.length)];
    setTaskTarget(picked);
    setTaskSubmitted(false);
    setTaskIsCorrect(false);
    setClickedCountry(null);
    setSelectedNeighborIsos([]);
    setNeighborResult(null);
    taskStartTimeRef.current = Date.now();
  }, [allCountries, features, taskType]);

  // Init task on mode change
  useEffect(() => {
    if (viewMode === 'tasks') {
      initNextTask();
    } else {
      setSelectedNeighborIsos([]);
      setNeighborResult(null);
      setTaskTarget(null);
    }
  }, [viewMode, taskType, initNextTask]);

  // Handle clicking a country geometry on the map (only if not dragging)
  const handleGeoClick = async (geo: any) => {
    // If user dragged more than 5px, it was a pan operation, so ignore click
    if (dragDistanceRef.current > 5) return;

    const country = getCountryFromGeo(geo);

    // EXPLORE MODE: selects country and displays in side panel
    if (viewMode === 'explore') {
      setSelectedGeo(geo);
      return;
    }

    // TASK MODE: LOCATE COUNTRY
    if (viewMode === 'tasks' && taskType === 'locate') {
      // Do not allow re-clicking if answer already submitted
      if (taskSubmitted || !taskTarget || !country) return;

      const timeMs = Date.now() - taskStartTimeRef.current;
      const isCorrect = country.iso2 === taskTarget.iso2;

      setClickedCountry(country);
      setTaskIsCorrect(isCorrect);
      setTaskSubmitted(true);

      // Save to Dexie
      await recordAnswer(taskTarget.iso2, 'map', isCorrect, timeMs);
      return;
    }

    // TASK MODE: FIND NEIGHBORS (Toggle selection)
    if (viewMode === 'tasks' && taskType === 'neighbors') {
      if (taskSubmitted || !country) return;

      // Don't select target itself
      if (country.iso2 === taskTarget?.iso2) return;

      setSelectedNeighborIsos((prev) =>
        prev.includes(country.iso2)
          ? prev.filter((iso) => iso !== country.iso2)
          : [...prev, country.iso2]
      );
    }
  };

  // Submit neighbor task
  const handleCheckNeighbors = async () => {
    if (!taskTarget || taskSubmitted) return;

    const timeMs = Date.now() - taskStartTimeRef.current;
    const targetNeighbors = taskTarget.neighbors || [];

    const correct = selectedNeighborIsos.filter((iso) => targetNeighbors.includes(iso));
    const wrong = selectedNeighborIsos.filter((iso) => !targetNeighbors.includes(iso));
    const missed = targetNeighbors.filter((iso) => !selectedNeighborIsos.includes(iso));
    const isFullSuccess = wrong.length === 0 && missed.length === 0;

    setNeighborResult({ correct, missed, wrong, isFullSuccess });
    setTaskIsCorrect(isFullSuccess);
    setTaskSubmitted(true);

    // Save to Dexie
    await recordAnswer(taskTarget.iso2, 'map', isFullSuccess, timeMs);
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    setIsCursorDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
    dragDistanceRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragDistanceRef.current = Math.hypot(dx, dy);
    setPan({
      x: Math.round(panStartRef.current.x + dx),
      y: Math.round(panStartRef.current.y + dy),
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsCursorDragging(false);
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    setIsCursorDragging(false);
    setHoveredGeo(null);
  };

  // Keyboard navigation for advancing tasks on Enter / Space
  useEffect(() => {
    if (viewMode !== 'tasks' || !taskSubmitted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        initNextTask();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, taskSubmitted, initNextTask]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Interaktywna mapa świata
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Przeglądaj państwa świata, badaj granice lądowe lub rozwiązuj zadania lokalizacyjne na żywo.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold shadow-2xs">
            <button
              onClick={() => setViewMode('explore')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                viewMode === 'explore'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Eksploracja</span>
            </button>
            <button
              onClick={() => setViewMode('tasks')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                viewMode === 'tasks'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Target className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Zadania na mapie</span>
            </button>
          </div>
        </div>
      </div>

      {/* Task Prompt Banner (If in Task Mode) */}
      {viewMode === 'tasks' && taskTarget && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {taskType === 'locate' ? 'Zadanie: Wskaż państwo' : 'Zadanie: Wskaż sąsiadów'}
              </span>

              {/* Task type selector */}
              <div className="inline-flex text-xs rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setTaskType('locate')}
                  className={`px-3 py-1 rounded-lg cursor-pointer transition-all font-medium ${
                    taskType === 'locate'
                      ? 'bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-slate-100 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Wskaż kraj
                </button>
                <button
                  onClick={() => setTaskType('neighbors')}
                  className={`px-3 py-1 rounded-lg cursor-pointer transition-all font-medium ${
                    taskType === 'neighbors'
                      ? 'bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-slate-100 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Znajdź sąsiadów
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span
                className={`fi fi-${taskTarget.iso2.toLowerCase()} text-2xl rounded-sm shadow-xs border border-slate-200 dark:border-slate-800`}
              />
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {taskType === 'locate'
                  ? `Kliknij na mapie: ${taskTarget.namePl}`
                  : `Zaznacz wszystkich sąsiadów państwa: ${taskTarget.namePl}`}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                ({taskTarget.continent} • Stolica: {taskTarget.capital})
              </span>
            </div>

            {taskType === 'neighbors' && !taskSubmitted && (
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                Liczba sąsiadów lądowych do zaznaczenia:{' '}
                <strong className="text-slate-900 dark:text-slate-100">
                  {taskTarget.neighbors?.length || 0}
                </strong>{' '}
                • Zaznaczono:{' '}
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {selectedNeighborIsos.length}
                </strong>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            {taskType === 'neighbors' && !taskSubmitted && (
              <button
                onClick={handleCheckNeighbors}
                disabled={selectedNeighborIsos.length === 0}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Sprawdź odpowiedź ({selectedNeighborIsos.length})
              </button>
            )}

            {taskSubmitted && (
              <button
                onClick={initNextTask}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-slate-950 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs animate-bounce"
              >
                <span>Następne zadanie</span>
                <span className="text-[10px] opacity-75 font-mono">(Enter)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid Layout: Spacious Map Canvas + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Map Canvas (Large workspace) */}
        <div
          ref={mapContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={`lg:col-span-8 xl:col-span-9 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 relative flex flex-col justify-between transition-colors shadow-sm select-none h-[580px] sm:h-[640px] lg:h-[700px] overflow-hidden ${
            isCursorDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {/* Controls: Zoom & Reset */}
          <div className="absolute top-5 right-5 z-20 flex flex-col gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-md">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Przybliż (scroll w górę)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Oddal (scroll w dół)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Zresetuj widok"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar inside explore mode */}
          {viewMode === 'explore' && (
            <div className="absolute top-5 left-5 z-20 w-64 sm:w-72">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Szukaj kraju (np. Francja, Japonia)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-full pl-9 pr-4 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-xs"
                />
              </div>
            </div>
          )}

          {/* Floating non-shifting Hover Tooltip */}
          {hoveredCountry && (
            <div className="absolute bottom-12 left-5 z-20 pointer-events-none flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/90 dark:bg-slate-800/95 text-white text-xs font-semibold backdrop-blur-md shadow-lg border border-white/10 animate-fadeIn">
              <span className={`fi fi-${hoveredCountry.iso2.toLowerCase()} text-base rounded-2xs`} />
              <span>{hoveredCountry.namePl}</span>
              <span className="text-slate-400 font-normal">({hoveredCountry.capital})</span>
            </div>
          )}

          {/* SVG Map Canvas */}
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full select-none"
              style={{ pointerEvents: 'auto' }}
            >
              {/* Ocean Background */}
              <rect
                width={width}
                height={height}
                className="fill-slate-100/90 dark:fill-slate-950/90"
                rx="12"
              />

              <g>
                {renderedFeatures.map(({ geo, id, d, country }) => {
                  if (!d) return null;

                  const isHovered = hoveredGeo === geo;
                  const isSelected = selectedGeo === geo;
                  const matchesSearch =
                    viewMode === 'explore' &&
                    searchQuery &&
                    country &&
                    (country.namePl.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      country.nameEn.toLowerCase().includes(searchQuery.toLowerCase()));

                  // Color styling logic
                  let fillClass =
                    'fill-slate-200/90 stroke-slate-300 dark:fill-slate-800/90 dark:stroke-slate-700/80';
                  let strokeWidth = 0.5;

                  if (viewMode === 'explore') {
                    if (isSelected) {
                      fillClass =
                        'fill-emerald-500 stroke-emerald-600 dark:fill-emerald-500 dark:stroke-emerald-400';
                      strokeWidth = 1.4;
                    } else if (matchesSearch) {
                      fillClass =
                        'fill-sky-500 stroke-sky-600 dark:fill-sky-500 dark:stroke-sky-400';
                      strokeWidth = 1.2;
                    } else if (isHovered) {
                      fillClass =
                        'fill-sky-400 stroke-sky-500 dark:fill-sky-600 dark:stroke-sky-400';
                    }
                  } else if (viewMode === 'tasks') {
                    const isTargetCountry = country?.iso2 === taskTarget?.iso2;
                    const isSelectedNeighbor =
                      country && selectedNeighborIsos.includes(country.iso2);

                    if (taskType === 'locate') {
                      if (taskSubmitted) {
                        if (isTargetCountry) {
                          fillClass =
                            'fill-emerald-500 stroke-emerald-600 dark:fill-emerald-500 dark:stroke-emerald-400';
                          strokeWidth = 1.6;
                        } else if (
                          country &&
                          clickedCountry?.iso2 === country.iso2 &&
                          !taskIsCorrect
                        ) {
                          fillClass =
                            'fill-rose-500 stroke-rose-600 dark:fill-rose-500 dark:stroke-rose-400';
                          strokeWidth = 1.4;
                        }
                      } else if (isHovered) {
                        fillClass =
                          'fill-sky-300 stroke-sky-400 dark:fill-sky-700 dark:stroke-sky-500';
                      }
                    } else if (taskType === 'neighbors') {
                      if (isTargetCountry) {
                        fillClass =
                          'fill-amber-400 stroke-amber-600 dark:fill-amber-500 dark:stroke-amber-400';
                        strokeWidth = 1.8;
                      } else if (taskSubmitted && neighborResult) {
                        if (country && neighborResult.correct.includes(country.iso2)) {
                          fillClass =
                            'fill-emerald-500 stroke-emerald-600 dark:fill-emerald-500 dark:stroke-emerald-400';
                          strokeWidth = 1.2;
                        } else if (country && neighborResult.wrong.includes(country.iso2)) {
                          fillClass =
                            'fill-rose-500 stroke-rose-600 dark:fill-rose-500 dark:stroke-rose-400';
                          strokeWidth = 1.2;
                        } else if (country && neighborResult.missed.includes(country.iso2)) {
                          fillClass =
                            'fill-amber-300 stroke-amber-500 dark:fill-amber-900/70 dark:stroke-amber-400';
                          strokeWidth = 1.2;
                        }
                      } else if (isSelectedNeighbor) {
                        fillClass =
                          'fill-sky-500 stroke-sky-600 dark:fill-sky-500 dark:stroke-sky-400';
                        strokeWidth = 1.2;
                      } else if (isHovered) {
                        fillClass =
                          'fill-slate-300 stroke-slate-400 dark:fill-slate-700 dark:stroke-slate-600';
                      }
                    }
                  }

                  return (
                    <path
                      key={id}
                      d={d}
                      vectorEffect="non-scaling-stroke"
                      className={`transition-colors duration-75 ${fillClass}`}
                      strokeWidth={strokeWidth}
                      onMouseEnter={() => setHoveredGeo(geo)}
                      onClick={() => handleGeoClick(geo)}
                    />
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Bottom helper tip */}
          <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1 z-10 border-t border-slate-100 dark:border-slate-800/80">
            <span>
              {viewMode === 'explore'
                ? 'Przeciągaj myszą, aby przesuwać mapę. Przewijaj kółkiem, aby płynnie przybliżać i oddalać.'
                : taskType === 'locate'
                ? 'Kliknij szukany kraj na mapie. Po odpowiedzi zobaczysz podsumowanie i przycisk Następne.'
                : 'Zaznacz kraje sąsiadujące kliknięciem, a następnie zatwierdź przyciskiem "Sprawdź".'}
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              Skala: {(zoom * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Side Panel: Country Details in Explore or Task Feedback in Tasks */}
        <div className="lg:col-span-4 xl:col-span-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 flex flex-col justify-between transition-colors shadow-xs">
          {viewMode === 'explore' ? (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Informacje o państwie</span>
              </h2>

              {selectedCountry ? (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center">
                    <span
                      className={`fi fi-${selectedCountry.iso2.toLowerCase()} text-5xl shadow-sm inline-block mb-3 rounded-sm border border-slate-200 dark:border-slate-800`}
                    />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {selectedCountry.namePl}
                    </h3>
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      {selectedCountry.nameEn} • {selectedCountry.continent}
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-500" /> Stolica:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {selectedCountry.capital}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-sky-500" /> Kod ISO2 / Num:
                      </span>
                      <span className="font-mono font-semibold uppercase text-slate-900 dark:text-slate-100">
                        {selectedCountry.iso2} / {selectedCountry.isoNumeric}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-500" /> Trudność (waga):
                      </span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {selectedCountry.difficultyWeight.toFixed(2)}
                      </span>
                    </div>

                    {/* Interactive Clickable Neighbors List */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                      <span className="text-slate-600 dark:text-slate-400 font-semibold text-xs block">
                        Sąsiedzi lądowi ({selectedCountry.neighbors?.length || 0}):
                      </span>

                      {selectedCountry.neighbors && selectedCountry.neighbors.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedCountry.neighbors.map((nIso) => {
                            const nCountry = isoMap.get(nIso);
                            return (
                              <button
                                key={nIso}
                                onClick={() => handleSelectNeighbor(nIso)}
                                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-xs flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium transition-all cursor-pointer shadow-2xs hover:scale-105"
                                title={`Przejdź do: ${nCountry?.namePl || nIso}`}
                              >
                                <span className={`fi fi-${nIso.toLowerCase()} text-xs rounded-2xs`} />
                                <span>{nCountry?.namePl || nIso}</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Brak sąsiadów lądowych (kraj wyspiarski).
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center">
                  <Globe className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Kliknij dowolne państwo na mapie, aby wyświetlić jego metadane i interaktywną listę sąsiadów lądowych.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* TASK MODE SIDEBAR */
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Panel zadania</span>
              </h2>

              {taskTarget && (
                <div className="space-y-4">
                  {/* Task Target Card */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold">
                      Szukane państwo:
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`fi fi-${taskTarget.iso2.toLowerCase()} text-2xl rounded-xs shadow-xs border border-slate-200 dark:border-slate-800`}
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-base block">
                          {taskTarget.namePl}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {taskTarget.nameEn} • {taskTarget.continent}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                      Stolica: <strong className="font-bold">{taskTarget.capital}</strong>
                    </div>
                  </div>

                  {/* Feedback Card after Answer */}
                  {taskSubmitted && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3 animate-fadeIn">
                      <div className="flex items-center gap-2">
                        {taskIsCorrect ? (
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Znakomicie! Zadanie zaliczone (+15 XP)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                            <XCircle className="w-5 h-5" />
                            <span>Niepoprawnie (+2 XP)</span>
                          </div>
                        )}
                      </div>

                      {taskType === 'locate' && clickedCountry && (
                        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
                          {taskIsCorrect ? (
                            <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                              Prawidłowo wskazano państwo {taskTarget.namePl} na mapie świata.
                            </p>
                          ) : (
                            <p>
                              Wskazano:{' '}
                              <strong className="text-rose-600 dark:text-rose-400">
                                {clickedCountry.namePl}
                              </strong>
                              , a szukanym państwem było:{' '}
                              <strong className="text-emerald-600 dark:text-emerald-400">
                                {taskTarget.namePl}
                              </strong>
                              .
                            </p>
                          )}
                        </div>
                      )}

                      {taskType === 'neighbors' && neighborResult && (
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span>Trafieni sąsiedzi:</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {neighborResult.correct.length} z {taskTarget.neighbors?.length || 0}
                            </span>
                          </div>

                          {neighborResult.missed.length > 0 && (
                            <div className="text-amber-600 dark:text-amber-400 text-[11px] leading-relaxed">
                              <strong>Pominięto ({neighborResult.missed.length}):</strong>{' '}
                              {neighborResult.missed
                                .map((iso) => isoMap.get(iso)?.namePl || iso)
                                .join(', ')}
                            </div>
                          )}

                          {neighborResult.wrong.length > 0 && (
                            <div className="text-rose-600 dark:text-rose-400 text-[11px] leading-relaxed">
                              <strong>Błędne zaznaczenia ({neighborResult.wrong.length}):</strong>{' '}
                              {neighborResult.wrong
                                .map((iso) => isoMap.get(iso)?.namePl || iso)
                                .join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2">
                    {taskSubmitted ? (
                      <button
                        onClick={initNextTask}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <span>Następne zadanie</span>
                        <span className="text-[10px] opacity-75 font-mono">(Enter)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="text-xs text-slate-500 dark:text-slate-400 text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60">
                        {taskType === 'locate'
                          ? 'Kliknij właściwe państwo na mapie.'
                          : 'Klikaj państwa, aby zaznaczyć sąsiadów, a następnie kliknij Sprawdź.'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
