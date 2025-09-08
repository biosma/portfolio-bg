'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Calendar,
  Database,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Palette,
  Shield,
  Smartphone,
  Users,
  Zap,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { LightboxCarousel } from '../lightbox-carousel';

export function MenaHomesSection({ miniature = false }) {
  const t = useTranslations('WorkPage.MenaHomes');
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredAchievement, setHoveredAchievement] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isTransitionComplete, setIsTransitionComplete] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Tomar features y achievements internacionalizables
  const features = [
    {
      icon: Shield,
      title: t('project_feature_1_title'),
      description: t('project_feature_1_desc'),
    },
    {
      icon: Smartphone,
      title: t('project_feature_2_title'),
      description: t('project_feature_2_desc'),
    },
    {
      icon: Database,
      title: t('project_feature_3_title'),
      description: t('project_feature_3_desc'),
    },
    {
      icon: Palette,
      title: t('project_feature_4_title'),
      description: t('project_feature_4_desc'),
    },
  ];

  const achievements = [
    {
      icon: Users,
      title: t('project_achievement_1_title'),
      description: t('project_achievement_1_desc'),
      impact: t('project_achievement_1_impact'),
    },
    {
      icon: Zap,
      title: t('project_achievement_2_title'),
      description: t('project_achievement_2_desc'),
      impact: t('project_achievement_2_impact'),
    },
    {
      icon: Globe,
      title: t('project_achievement_3_title'),
      description: t('project_achievement_3_desc'),
      impact: t('project_achievement_3_impact'),
    },
    {
      icon: FileText,
      title: t('project_achievement_4_title'),
      description: t('project_achievement_4_desc'),
      impact: t('project_achievement_4_impact'),
    },
    {
      icon: BarChart3,
      title: t('project_achievement_5_title'),
      description: t('project_achievement_5_desc'),
      impact: t('project_achievement_5_impact'),
    },
    {
      icon: Calendar,
      title: t('project_achievement_6_title'),
      description: t('project_achievement_6_desc'),
      impact: t('project_achievement_6_impact'),
    },
  ];

  const project = {
    title: t('main_title') || 'TradeNetHub - Custom ERP System',
    role: t('main_role') || 'Front-end Lead Developer',
    period: t('project_period'),
    company: 'Trade Net Hub',
    description: t('project_overview_content'),
    images: [
      '/menahomes/Home.png',
      '/menahomes/Trending_Homes_EN.png',
      '/menahomes/Trending_Homes_AR.png',
      '/menahomes/Mortgage_Calculator_EN.png',
      '/menahomes/Mortgage_Calculator_AR.png',
    ],
    demoUrl: '#',
    codeUrl: '#',
    technologies: {
      frontend: ['React Native', 'Tailwind CSS', 'Next.js', 'I18next'],
      backend: ['MongoDB', 'Nest.js', 'Auth.js'],
      aws: ['AWS SES', 'AWS EC2', 'AWS S3', 'AWS (Other services)'],
      integrations: ['Stripe', 'Google Maps', 'Google Analytics', 'Firebase'],
      tools: ['TypeScript', 'React Hook Form', 'Zod', 'ESLint/Prettier'],
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Verificar si hay una transición desde AnimatedCard
    const hasOverlayTransition = sessionStorage.getItem('overlay-transition') === '1';

    if (hasOverlayTransition) {
      setShowOverlay(true);

      // Remover la marca de transición
      sessionStorage.removeItem('overlay-transition');

      // Ocultar el overlay después de un tiempo específico
      timeoutId = setTimeout(() => {
        setShowOverlay(false);
        setIsTransitionComplete(true);
      }, 400); // Tiempo sincronizado con la animación del overlay
    } else {
      // Si no hay transición, mostrar contenido inmediatamente
      setIsTransitionComplete(true);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // No renderizar nada si estamos esperando la transición
  if (!isTransitionComplete && !showOverlay) {
    return <div className="w-full h-screen" />; // Placeholder para evitar layout shift
  }

  return (
    <>
      {/* FULLSCREEN OVERLAY DE TRANSICIÓN */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{
              opacity: 1,
              scale: 1,
              borderRadius: 0,
              rotateX: 0,
              rotateY: 0,
              boxShadow: '0 10px 24px rgba(0,0,0,0.16)',
            }}
            animate={{
              opacity: 0,
              scale: 0.96,
              borderRadius: 24,
              boxShadow: '0 0px 0px rgba(0,0,0,0.01)',
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.48,
              ease: [0.44, 0, 0.56, 1],
              scale: { duration: 0.38, ease: [0.4, 0, 0.2, 1] },
              borderRadius: { duration: 0.38, ease: [0.44, 0, 0.56, 1] },
              opacity: { duration: 0.22 },
            }}
            onAnimationComplete={() => setIsTransitionComplete(true)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: '#fff',
              zIndex: 99999,
              pointerEvents: 'none',
              willChange: 'opacity, scale, border-radius, box-shadow',
            }}
          />
        )}
      </AnimatePresence>

      {/* Contenido principal con animación condicional */}
      <motion.section
        className={miniature ? 'py-0 px-4 bg-gradient-to-br' : 'py-12 px-4 bg-gradient-to-br'}
        initial={isTransitionComplete && !showOverlay ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: showOverlay ? 0.2 : 0 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Animated Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: showOverlay ? 0.3 : 0 }}
          >
            <h2 className="text-3xl font-bold mb-4">{t('featured_project_header')}</h2>
            <p className="text-lg max-w-2xl mx-auto">{t('featured_project_subtitle')}</p>
          </motion.div>

          {/* Main Project Card with Enhanced Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: showOverlay ? 0.4 : 0.2 }}
          >
            <Card className="overflow-hidden shadow-2xl border-0 p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Enhanced Image Section */}
                <div
                  className={
                    miniature
                      ? 'relative h-96 lg:h-auto group bg-white place-items-start place-content-start'
                      : 'relative h-96 lg:h-auto group bg-white place-items-center place-content-center'
                  }
                  onClick={() => {
                    setLightboxIndex(0);
                    setLightboxOpen(true);
                  }}
                >
                  <Image
                    src={project.images[0]}
                    alt={project.title}
                    width={610}
                    height={500}
                    className="object-cover transition-transform duration-500 cursor-zoom-in"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Project Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white mb-2">
                      {t('project_period')}
                    </Badge>
                    <h3 className="text-white text-2  xl font-bold mb-1">{project.title}</h3>
                    <p className="text-blue-100 font-medium mb-4">{t('work_experience_1_title')}</p>
                  </div>
                </div>

                {/* Enhanced Content Section with Tabs */}
                <CardContent className="p-8 lg:p-12">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="overview">{t('project_overview_tab')}</TabsTrigger>
                      <TabsTrigger value="tech">{t('project_tech_tab')}</TabsTrigger>
                    </TabsList>

                    <div className="min-h-[580px]">
                      <TabsContent value="overview" className="space-y-6">
                        <div>
                          <h4 className="text-md font-semibold mb-3">
                            {t('project_overview_header')}
                          </h4>
                          <p className="leading-relaxed text-sm">{project.description}</p>
                        </div>

                        <div>
                          <h4 className="text-md font-semibold mb-4">
                            {t('project_features_header')}
                          </h4>
                          <div className="grid gap-3">
                            {features.map((feature, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                                whileHover={{ x: 4 }}
                              >
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <feature.icon className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">{feature.title}</h5>
                                  <p className="text-xs">{feature.description}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="tech" className="space-y-6">
                        {Object.entries(project.technologies).map(([category, techs]) => (
                          <div key={category}>
                            <h4 className="text-lg font-semibold mb-3 capitalize">
                              {t(`project_tech_category_${category}`)}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {techs.map((tech, index) => (
                                <motion.div
                                  key={index}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Badge
                                    variant="secondary"
                                    className="bg-gray-100  hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer"
                                  >
                                    {tech}
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </div>
            </Card>
          </motion.div>

          {/* Enhanced Achievements Grid */}
          <motion.div
            className="mt-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-xl font-bold text-center mb-12">
              {t('project_achievements_header')}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  onHoverStart={() => setHoveredAchievement(index)}
                  onHoverEnd={() => setHoveredAchievement(null)}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="px-6 py-2">
                      <div className="flex items-start gap-4 mb-4">
                        <motion.div
                          className="p-3 bg-blue-100 rounded-lg"
                          animate={{
                            scale: hoveredAchievement === index ? 1.1 : 1,
                            backgroundColor: hoveredAchievement === index ? '#3B82F6' : '#DBEAFE',
                          }}
                        >
                          <achievement.icon
                            className={`w-6 h-6 transition-colors ${
                              hoveredAchievement === index ? 'text-white' : 'text-blue-600'
                            }`}
                          />
                        </motion.div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2 text-md">{achievement.title}</h4>
                          <p className="text-sm leading-relaxed mb-3">{achievement.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced CTA Section */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.1%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
              </div>

              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4 text-center text-white">
                  {t('cta_similar_solutions_header')}
                </h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-center text-md">
                  {t('cta_similar_solutions_text')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-white text-blue-600 px-6 py-3 font-semibold hover:bg-gray-100 cursor-pointer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {t('cta_view_more_projects')}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="border-2 border-white text-white px-6 py-3 font-semibold hover:bg-white hover:text-blue-600 dark:hover:bg-white dark:hover:text-blue-600 bg-transparent cursor-pointer"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      {t('cta_get_in_touch')}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      <LightboxCarousel
        images={project.images}
        startIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        autoplay={false} // poné true si querés reproducción automática
      />
    </>
  );
}
