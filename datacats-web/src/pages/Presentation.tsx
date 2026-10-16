import { FileSpreadsheet, BarChart3, Map, Database, X, ZoomIn } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const galleryItems = [
  { id: 1, title: 'Executive Summary', platform: 'Power BI', color: 'gold' },
  { id: 2, title: 'Sales Pipeline', platform: 'Tableau', color: 'cyan' },
  { id: 3, title: 'Financial Workbook', platform: 'Excel', color: 'green' },
  { id: 4, title: 'Warehouse Metrics', platform: 'BigQuery', color: 'slate' },
  { id: 5, title: 'Client Journey', platform: 'Power BI', color: 'gold' },
  { id: 6, title: 'Utilization Heatmap', platform: 'Tableau', color: 'cyan' },
];

export function Presentation() {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter ? galleryItems.filter((i) => i.platform === filter) : galleryItems;
  const platforms = Array.from(new Set(galleryItems.map((i) => i.platform)));

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
            Interactive Screenshot Gallery
          </h2>
          <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">
            Click any sample to preview. Filter by platform.
          </p>
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
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <button
                  onClick={() => setSelected(item.id)}
                  className="w-full text-left"
                >
                  <Card className="group relative aspect-[16/10] overflow-hidden p-0">
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6 dark:from-slate-800 dark:to-slate-900">
                      <BarChart3 className="mb-4 h-12 w-12 text-brand-gold/50 transition-transform duration-200 group-hover:scale-110 dark:text-brand-cyan/50" />
                      <h3 className="text-center font-semibold text-light-text-primary dark:text-dark-text-primary">
                        {item.title}
                      </h3>
                    </div>
                    <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <ZoomIn className="h-5 w-5 text-light-text-primary dark:text-dark-text-primary" />
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <Badge variant={item.color as 'gold' | 'cyan' | 'slate' | 'default'}>{item.platform}</Badge>
                    </div>
                  </Card>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Section>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-light-card p-8 dark:bg-dark-card"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="mb-4 text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                {galleryItems.find((i) => i.id === selected)?.title}
              </h3>
              <div className="aspect-video rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900" />
              <p className="mt-4 text-light-text-secondary dark:text-dark-text-secondary">
                Sample report preview. In production this would show the actual dashboard screenshot.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
