import { FileSpreadsheet, BarChart3, Map, Database, X, ZoomIn, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { HeroBlock } from '../components/sections/HeroBlock';
import { Section } from '../components/sections/Section';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const capabilities = [
  {
    icon: FileSpreadsheet,
    title: 'Beautiful Automated Excel Reports',
    description: 'Advanced macro-driven or PowerQuery workbooks for teams that love spreadsheets.',
    tag: 'Excel',
    color: 'green',
  },
  {
    icon: BarChart3,
    title: 'Power BI Dashboards',
    description: 'Interactive, real-time enterprise-grade reporting with cross-filtering.',
    tag: 'Power BI',
    color: 'gold',
  },
  {
    icon: Map,
    title: 'Tableau Workbooks',
    description: 'Rich geospatial and complex statistical visualization.',
    tag: 'Tableau',
    color: 'cyan',
  },
  {
    icon: Database,
    title: 'BigQuery & Cloud Warehousing',
    description: 'Scalable data pipelines for high-volume analysis.',
    tag: 'BigQuery',
    color: 'slate',
  },
];

interface GalleryItem {
  id: number;
  title: string;
  platform: string;
  color: string;
  lightImage?: string;
  darkImage?: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'Executive Summary',
    platform: 'Power BI',
    color: 'gold',
    lightImage: '/assets/img/samples/light-sample1.png',
    darkImage: '/assets/img/samples/dark-sample1.png',
  },
  { id: 2, title: 'Sales Pipeline', platform: 'Tableau', color: 'cyan' },
  { id: 3, title: 'Financial Workbook', platform: 'Excel', color: 'green' },
  { id: 4, title: 'Warehouse Metrics', platform: 'BigQuery', color: 'slate' },
  { id: 5, title: 'Client Journey', platform: 'Power BI', color: 'gold' },
  { id: 6, title: 'Utilization Heatmap', platform: 'Tableau', color: 'cyan' },
];

export function Presentation() {
  const { theme } = useTheme();
  // Opposite contrast by default: light site theme -> dark reports, dark site theme -> light reports
  const defaultReportTheme: 'light' | 'dark' = theme === 'light' ? 'dark' : 'light';

  const [reportThemeState, setReportThemeState] = useState<{
    siteTheme: 'light' | 'dark';
    sectionTheme: 'light' | 'dark';
  }>({
    siteTheme: theme,
    sectionTheme: defaultReportTheme,
  });

  const sectionReportTheme =
    reportThemeState.siteTheme === theme ? reportThemeState.sectionTheme : defaultReportTheme;

  const [selected, setSelected] = useState<number | null>(null);
  const [zoomedThemeOverride, setZoomedThemeOverride] = useState<'light' | 'dark' | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const toggleSectionReportTheme = () => {
    const nextTheme: 'light' | 'dark' = sectionReportTheme === 'dark' ? 'light' : 'dark';
    setReportThemeState({
      siteTheme: theme,
      sectionTheme: nextTheme,
    });
    setZoomedThemeOverride(null);
  };

  const openReportModal = (id: number) => {
    setSelected(id);
    setZoomedThemeOverride(null);
  };

  const closeReportModal = () => {
    setSelected(null);
    setZoomedThemeOverride(null);
  };

  const activeZoomedTheme: 'light' | 'dark' = zoomedThemeOverride ?? sectionReportTheme;

  const toggleZoomedReportTheme = () => {
    setZoomedThemeOverride(activeZoomedTheme === 'dark' ? 'light' : 'dark');
  };

  const filtered = filter ? galleryItems.filter((i) => i.platform === filter) : galleryItems;
  const platforms = Array.from(new Set(galleryItems.map((i) => i.platform)));
  const selectedItem = galleryItems.find((i) => i.id === selected);
  const selectedImage = selectedItem
    ? activeZoomedTheme === 'dark'
      ? selectedItem.darkImage
      : selectedItem.lightImage
    : undefined;

  return (
    <>
      <HeroBlock
        title="Your Data. Delivered in Any Flavor You Need."
        subtitle="From Excel workbooks to enterprise Power BI and Tableau dashboards—delivered how your team actually works."
        primaryCta={{ label: 'See Sample Reports', href: '#gallery' }}
        secondaryCta={{ label: 'Talk to Us', to: '/contact' }}
        centered
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap) => (
            <Card key={cap.title} className="h-full">
              <cap.icon className="mb-4 h-10 w-10 text-brand-gold dark:text-brand-cyan" />
              <h3 className="mb-2 text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                {cap.title}
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {cap.description}
              </p>
              <div className="mt-4">
                <Badge variant={cap.color as 'gold' | 'cyan' | 'slate' | 'default'}>{cap.tag}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="gallery" muted>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
            Report Samples
          </h2>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-light-text-secondary dark:text-dark-text-secondary">
            <p>Use the theme switcher to preview light/dark versions of the reports.</p>
            <button
              type="button"
              onClick={toggleSectionReportTheme}
              aria-label={
                sectionReportTheme === 'dark'
                  ? 'Preview light versions of reports'
                  : 'Preview dark versions of reports'
              }
              className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-light-card p-2 text-light-text-secondary shadow-sm transition-all duration-200 hover:scale-110 hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/50 dark:bg-dark-card dark:text-dark-text-secondary dark:hover:text-brand-cyan"
            >
              <span className="transition-transform duration-300 group-hover:animate-cat-swipe">
                {sectionReportTheme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </span>
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setFilter(null)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === null
                ? 'bg-brand-gold text-slate-900 dark:bg-brand-cyan'
                : 'bg-light-card text-light-text-secondary hover:text-light-text-primary dark:bg-dark-card dark:text-dark-text-secondary dark:hover:text-dark-text-primary'
            }`}
          >
            All
          </button>
          {platforms.map((platform) => (
            <button
              key={platform}
              onClick={() => setFilter(platform)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === platform
                  ? 'bg-brand-gold text-slate-900 dark:bg-brand-cyan'
                  : 'bg-light-card text-light-text-secondary hover:text-light-text-primary dark:bg-dark-card dark:text-dark-text-secondary dark:hover:text-dark-text-primary'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((item) => {
              const itemImage =
                sectionReportTheme === 'dark' ? item.darkImage : item.lightImage;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <button
                    onClick={() => openReportModal(item.id)}
                    className="w-full text-left"
                  >
                    <Card className="group relative aspect-[16/10] overflow-hidden p-0">
                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={`${item.title} (${item.platform} ${sectionReportTheme} theme sample)`}
                          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6 dark:from-slate-800 dark:to-slate-900">
                          <BarChart3 className="mb-4 h-12 w-12 text-brand-gold/50 transition-transform duration-200 group-hover:scale-110 dark:text-brand-cyan/50" />
                          <h3 className="text-center font-semibold text-light-text-primary dark:text-dark-text-primary">
                            {item.title}
                          </h3>
                        </div>
                      )}
                      <div className="absolute right-3 top-3 rounded-full bg-light-card/80 p-1.5 opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 dark:bg-dark-card/80">
                        <ZoomIn className="h-5 w-5 text-light-text-primary dark:text-dark-text-primary" />
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <Badge variant={item.color as 'gold' | 'cyan' | 'slate' | 'default'}>{item.platform}</Badge>
                      </div>
                    </Card>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </Section>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeReportModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-5xl overflow-auto rounded-2xl bg-light-card p-6 sm:p-8 dark:bg-dark-card"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4 pr-12">
                <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  {selectedItem.title}
                </h3>
                <button
                  type="button"
                  onClick={toggleZoomedReportTheme}
                  aria-label={
                    activeZoomedTheme === 'dark' ? 'View Light Version' : 'View Dark Version'
                  }
                  className="group flex items-center gap-2 rounded-full bg-slate-100 px-3.5 py-2 text-sm font-medium text-light-text-secondary shadow-sm transition-all duration-200 hover:scale-105 hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/50 dark:bg-slate-800 dark:text-dark-text-secondary dark:hover:text-brand-cyan"
                >
                  <span className="transition-transform duration-300 group-hover:animate-cat-swipe">
                    {activeZoomedTheme === 'dark' ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </span>
                  <span>
                    {activeZoomedTheme === 'dark' ? 'View Light Version' : 'View Dark Version'}
                  </span>
                </button>
              </div>
              <button
                onClick={closeReportModal}
                aria-label="Close preview"
                className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={`${selectedItem.title} (${selectedItem.platform} ${activeZoomedTheme} theme preview)`}
                  className="w-full rounded-xl border border-slate-200/60 shadow-lg dark:border-slate-700/60"
                />
              ) : (
                <>
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900" />
                  <p className="mt-4 text-light-text-secondary dark:text-dark-text-secondary">
                    Sample report preview. In production this would show the actual dashboard screenshot.
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
