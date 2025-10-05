"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Movie } from "@/types/movie";
import { getFullMovies } from "@/lib/movieData";
import Icon from "./Icon";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  maxSuggestions?: number; // Maksymalna liczba podpowiedzi
  redirectType?: 'movie' | 'recommender'; // Typ przekierowania: do filmu czy do rekomendacji
}

export default function SearchBar({
  onSearch,
  placeholder = "Szukaj filmu...",
  maxSuggestions = 6, // Zmieniam z powrotem na 6
  redirectType = 'movie', // Domyślnie przekierowanie do filmu
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<{text: string; movieId?: number; type: 'movie' | 'actor' | 'director'}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [moviesLoaded, setMoviesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Wykrywanie szerokości ekranu
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px = md breakpoint w Tailwind
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Ładowanie pełnych danych przy pierwszym użyciu
  useEffect(() => {
    if (!moviesLoaded) {
      getFullMovies().then((fullMovies) => {
        setMovies(fullMovies);
        setMoviesLoaded(true);
      });
    }
  }, [moviesLoaded]);

  // Generowanie podpowiedzi na podstawie danych filmów
  const generateSuggestions = useCallback((query: string): {text: string; movieId?: number; type: 'movie' | 'actor' | 'director'}[] => {
    if (!query.trim() || query.length < 2) return [];
    
    const lowerQuery = query.toLowerCase();
    const movieSuggestions: { text: string; movieId?: number; type: 'movie' | 'actor' | 'director'; priority: number; matchType: 'exact' | 'starts' | 'contains' }[] = [];
    
    movies.forEach((movie) => {
      // 1. TYTUŁY FILMÓW (najwyższy priorytet)
      if (movie.title) {
        const titleLower = movie.title.toLowerCase();
        if (titleLower.includes(lowerQuery)) {
          let priority = 5; // bazowy priorytet dla filmów
          let matchType: 'exact' | 'starts' | 'contains' = 'contains';
          
          if (titleLower === lowerQuery) {
            priority = 20; // dokładne dopasowanie
            matchType = 'exact';
          } else if (titleLower.startsWith(lowerQuery)) {
            priority = 15; // zaczyna się od frazy
            matchType = 'starts';
          } else if (titleLower.startsWith(lowerQuery + ' ')) {
            priority = 12; // zaczyna się od frazy + spacja
            matchType = 'starts';
          }
          
          movieSuggestions.push({ 
            text: movie.title, 
            movieId: movie.id, 
            type: 'movie', 
            priority, 
            matchType 
          });
        }
      }
      
      // 2. AKTORZY (tylko jeśli query ma więcej niż 3 znaki)
      if (query.length > 3 && movie.actors && Array.isArray(movie.actors)) {
        movie.actors.forEach((actor) => {
          if (actor.name) {
            const actorLower = actor.name.toLowerCase();
            if (actorLower.includes(lowerQuery)) {
              let priority = 3;
              let matchType: 'exact' | 'starts' | 'contains' = 'contains';
              
              if (actorLower.startsWith(lowerQuery)) {
                priority = 8;
                matchType = 'starts';
              }
              
              movieSuggestions.push({ 
                text: actor.name, 
                type: 'actor', 
                priority, 
                matchType 
              });
            }
          }
        });
      }
      
      // 3. REŻYSERZY (tylko jeśli query ma więcej niż 3 znaki)
      if (query.length > 3 && movie.directors) {
        const directors = movie.directors.split(',');
        directors.forEach((director) => {
          const trimmedDirector = director.trim();
          const directorLower = trimmedDirector.toLowerCase();
          if (trimmedDirector && directorLower.includes(lowerQuery)) {
            let priority = 2;
            let matchType: 'exact' | 'starts' | 'contains' = 'contains';
            
            if (directorLower.startsWith(lowerQuery)) {
              priority = 6;
              matchType = 'starts';
            }
            
            movieSuggestions.push({ 
              text: trimmedDirector, 
              type: 'director', 
              priority, 
              matchType 
            });
          }
        });
      }
    });
    
    // Usuwanie duplikatów i zachowanie najwyższego priorytetu
    const uniqueSuggestions = new Map<string, { movieId?: number; type: 'movie' | 'actor' | 'director'; priority: number; matchType: 'exact' | 'starts' | 'contains' }>();
    movieSuggestions.forEach(({ text, movieId, type, priority, matchType }) => {
      const existing = uniqueSuggestions.get(text);
      if (!existing || priority > existing.priority) {
        uniqueSuggestions.set(text, { movieId, type, priority, matchType });
      }
    });
    
    return Array.from(uniqueSuggestions.entries())
      .sort((a, b) => {
        // Najpierw według priorytetu (malejąco)
        if (a[1].priority !== b[1].priority) return b[1].priority - a[1].priority;
        
        // Jeśli priorytet taki sam, sortuj według typu dopasowania
        const typeOrder = { exact: 0, starts: 1, contains: 2 };
        if (a[1].matchType !== b[1].matchType) return typeOrder[a[1].matchType] - typeOrder[b[1].matchType];
        
        // Na końcu alfabetycznie
        return a[0].localeCompare(b[0]);
      })
      .slice(0, maxSuggestions)
      .map(([text, data]) => ({ text, movieId: data.movieId, type: data.type }));
  }, [movies, maxSuggestions]);

  // Aktualizacja podpowiedzi przy zmianie wyszukiwanego tekstu
  useEffect(() => {
    const newSuggestions = generateSuggestions(searchTerm);
    setSuggestions(newSuggestions);
    // Pokazuj dropdown gdy jest tekst (długość >= 2) - niezależnie od liczby wyników
    setShowSuggestions(searchTerm.length >= 2);
    setSelectedIndex(-1);
  }, [searchTerm, movies, generateSuggestions]);

  // Obsługa klawiatury
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          // Ukryj podpowiedzi i blur overlay przy zwykłym submicie
          setShowSuggestions(false);
          setSelectedIndex(-1);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (suggestion: {text: string; movieId?: number; type: 'movie' | 'actor' | 'director'}) => {
    // Zawsze ukrywaj podpowiedzi i blur overlay
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    if (suggestion.type === 'movie' && suggestion.movieId) {
      // Przekierowanie w zależności od typu
      if (redirectType === 'recommender') {
        // W recommender - przekieruj do rekomendacji z aktualnie wybranym silnikiem
        const currentEngine = localStorage.getItem('reco_engine') || 'v2';
        router.push(`/recommender/${suggestion.movieId}?engine=${currentEngine}`);
      } else {
        // W movies - przekieruj do strony filmu
        router.push(`/movies/${suggestion.movieId}`);
      }
    } else {
      // Jeśli to aktor lub reżyser, wykonaj wyszukiwanie
      setSearchTerm(suggestion.text);
      onSearch(suggestion.text.trim());
    }
  };

  const handleInputFocus = () => {
    if (searchTerm.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Opóźnienie, aby umożliwić kliknięcie w podpowiedź
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearch(searchTerm.trim());
  };

  return (
    <>
      {/* Overlay z blur dla tła */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40" //jak bedize lagowało to usunąć
            onClick={() => {
              setShowSuggestions(false);
              setSelectedIndex(-1);
            }}
          />
        )}
      </AnimatePresence>

      {/* SearchBar - zawsze na wierzchu */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative w-full mb-4 z-50"
      >
      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="w-full text-sm shadow-xl md:text-md px-4 py-2 rounded-lg bg-white/7 border border-white/30 text-white focus:outline-none focus:ring-1 focus:ring-white/40 hover:bg-white/10 transition duration-300"
          autoComplete="off"
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm shadow-xl bg-white/7 border border-white/30 rounded-lg text-white hover:bg-white/10 transition"
        >
          Search
        </button>
      </form>

      {/* Podpowiedzi */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            ref={suggestionsRef}
            initial={{ 
              opacity: 0, 
              y: -15,
              scale: 0.95,
              rotateX: -10
            }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: 1,
              rotateX: 0
            }}
            exit={{ 
              opacity: 0, 
              y: -10,
              scale: 0.95,
              rotateX: 5
            }}
            transition={{ 
              duration: 0.2,
              ease: "easeOut"
            }}
            className="absolute z-50 w-full mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl overflow-hidden"
            style={{ 
              top: "100%",
              transformOrigin: "top center"
            }}
          >
            {suggestions.length > 0 ? (
              suggestions.slice(0, isMobile ? 3 : maxSuggestions).map((suggestion, index, displayedSuggestions) => (
              <motion.div
                key={`${suggestion.text}-${suggestion.type}-${index}`}
                initial={{ 
                  opacity: 0, 
                  x: -20, 
                  scale: 0.95 
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  scale: 1 
                }}
                exit={{ 
                  opacity: 0, 
                  x: 20, 
                  scale: 0.95 
                }}
                transition={{ 
                  duration: 0.15, 
                  delay: index * 0.03,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.15 }
                }}
                whileTap={{ 
                  scale: 1.02,
                  transition: { duration: 0.1 }
                }}
                className={`px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center gap-3 ${
                  index === selectedIndex
                    ? "bg-white/20 text-white"
                    : "text-white/90 hover:bg-white/15"
                } ${index === displayedSuggestions.length - 1 ? "" : "border-b border-white/10"}`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {/* Ikona typu po lewej */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: index * 0.03 + 0.05,
                    duration: 0.15,
                    ease: "easeOut"
                  }}
                >
                  <Icon 
                    icon={suggestion.type === 'movie' ? 'movie' : suggestion.type === 'actor' ? 'person' : 'video_camera_front'} 
                    className="text-white/90 !text-lg flex-shrink-0"
                  />
                </motion.div>
                
                {/* Tekst w środku */}
                <span className="text-sm flex-grow">
                  {suggestion.text.split(new RegExp(`(${searchTerm})`, 'gi')).map((part: string, i: number) => 
                    part.toLowerCase() === searchTerm.toLowerCase() ? (
                      <span key={i} className="font-semibold text-white">
                        {part}
                      </span>
                    ) : (
                      part
                    )
                  )}
                </span>
                
                {/* Przycisk akcji po prawej */}
                <motion.div 
                  className="flex items-center gap-1 text-white/80"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.05 + 0.15,
                    duration: 0.2
                  }}
                >
                  <span className="text-xs hidden sm:inline">
                    {suggestion.type === 'movie' ? (redirectType === 'recommender' ? 'Zobacz' : 'Sprawdź') : 'Szukaj'}
                  </span>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Icon 
                      icon={suggestion.type === 'movie' ? 'arrow_forward' : 'search'} 
                      className="!text-sm"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            ))
            ) : (
              // Komunikat "Brak wyników"
              <motion.div
                initial={{ 
                  opacity: 0, 
                  y: 10
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0
                }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeOut"
                }}
                className="px-4 py-6 text-center text-white/90"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.1,
                    duration: 0.2,
                    ease: "easeOut"
                  }}
                >
                  <Icon 
                    icon="search_off" 
                    className="text-white/70 !text-2xl mb-2"
                  />
                </motion.div>
                <motion.div 
                  className="text-sm font-medium"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Brak wyników dla &quot;{searchTerm}&quot;
                </motion.div>
                <motion.div 
                  className="text-xs text-white/60 mt-1"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Spróbuj innej frazy
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </>
  );
}
