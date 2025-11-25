// Base de données des exercices de cross training
const EXERCISES_DATABASE = {
  // Squats - 3 niveaux
  'squat-n1': {
    id: 'squat-n1',
    name: 'Squat',
    level: 1,
    image: 'assets/exercises/squat N1.png',
    category: 'Membres inférieurs',
    successCriteria: [
      'Pieds écartés largeur des épaules',
      'Descendre les fesses en arrière comme pour s\'asseoir',
      'Genoux alignés avec les pointes de pieds',
      'Cuisses parallèles au sol',
      'Dos droit, regard devant',
      'Talons au sol pendant tout le mouvement'
    ],
    tips: 'Gardez le poids sur les talons et poussez fort pour remonter.'
  },
  'squat-n2': {
    id: 'squat-n2',
    name: 'Squat Sauté',
    level: 2,
    image: 'assets/exercises/squat niveau 2 .png',
    category: 'Membres inférieurs',
    successCriteria: [
      'Mêmes critères que le squat classique',
      'Descente contrôlée en squat',
      'Impulsion explosive vers le haut',
      'Décoller les pieds du sol',
      'Réception souple et contrôlée',
      'Enchaîner directement le squat suivant'
    ],
    tips: 'Amortissez bien la réception pour protéger vos genoux.'
  },
  'squat-n3': {
    id: 'squat-n3',
    name: 'Squat Pistol',
    level: 3,
    image: 'assets/exercises/squat niveau 3.png',
    category: 'Membres inférieurs',
    successCriteria: [
      'Tenir en équilibre sur une jambe',
      'Jambe libre tendue devant',
      'Descendre en squat sur une jambe',
      'Cuisse parallèle au sol',
      'Dos droit, bras tendus devant pour l\'équilibre',
      'Remonter sans poser l\'autre pied'
    ],
    tips: 'Exercice très difficile ! Utilisez un support au début si nécessaire.'
  },

  // Push-ups - 3 niveaux
  'pushup-n1': {
    id: 'pushup-n1',
    name: 'Pompes sur Genoux',
    level: 1,
    image: 'assets/exercises/push-up niveau 1.png',
    category: 'Membres supérieurs',
    successCriteria: [
      'Genoux au sol, corps aligné des genoux aux épaules',
      'Mains écartées largeur des épaules',
      'Descendre la poitrine près du sol',
      'Coudes à 45° du corps',
      'Gainage du tronc maintenu',
      'Remonter en poussant fort'
    ],
    tips: 'Ne cassez pas les hanches, gardez le corps bien aligné.'
  },
  'pushup-n2': {
    id: 'pushup-n2',
    name: 'Pompes Classiques',
    level: 2,
    image: 'assets/exercises/push-up niveau 2.png',
    category: 'Membres supérieurs',
    successCriteria: [
      'Corps aligné des pieds à la tête',
      'Appui sur les pointes de pieds et les mains',
      'Mains sous les épaules',
      'Descendre la poitrine à 5 cm du sol',
      'Coudes près du corps',
      'Gainage complet du corps'
    ],
    tips: 'Serrez les abdos et les fessiers pour garder le corps droit.'
  },
  'pushup-n3': {
    id: 'pushup-n3',
    name: 'Pompes Déclinées',
    level: 3,
    image: 'assets/exercises/push-up niveau 3.png',
    category: 'Membres supérieurs',
    successCriteria: [
      'Pieds surélevés sur un support',
      'Corps aligné en position inclinée',
      'Mêmes critères que pompes classiques',
      'Amplitude complète du mouvement',
      'Contrôle de la descente',
      'Poussée explosive'
    ],
    tips: 'Plus les pieds sont hauts, plus c\'est difficile !'
  },

  // Jumping Jacks
  'jumping-jack': {
    id: 'jumping-jack',
    name: 'Jumping Jack',
    level: 1,
    image: 'assets/exercises/jumping jack.png',
    category: 'Cardio',
    successCriteria: [
      'Position de départ : pieds joints, bras le long du corps',
      'Sauter en écartant les jambes',
      'Lever les bras au-dessus de la tête',
      'Revenir en position initiale d\'un bond',
      'Mouvement rythmé et continu',
      'Réception sur la pointe des pieds'
    ],
    tips: 'Gardez un rythme constant et respirez régulièrement.'
  },

  // Burpees
  'burpees': {
    id: 'burpees',
    name: 'Burpees',
    level: 2,
    image: 'assets/exercises/burpees.png',
    category: 'Full body',
    successCriteria: [
      'Départ debout, descendre en squat',
      'Poser les mains au sol',
      'Lancer les pieds en arrière en position planche',
      'Faire une pompe (optionnel selon niveau)',
      'Ramener les pieds vers les mains',
      'Sauter en levant les bras'
    ],
    tips: 'Exercice complet très intense ! Adaptez le rythme à votre niveau.'
  },

  // Mountain Climbers
  'mountain-climbers': {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    level: 2,
    image: 'assets/exercises/moutain climbers.png',
    category: 'Cardio / Gainage',
    successCriteria: [
      'Position de planche, bras tendus',
      'Corps aligné et gainé',
      'Ramener un genou vers la poitrine',
      'Alterner rapidement les jambes',
      'Garder les hanches basses',
      'Mouvement dynamique et continu'
    ],
    tips: 'Imaginez que vous courez en position de planche !'
  },

  // Planche
  'planche': {
    id: 'planche',
    name: 'Planche',
    level: 1,
    image: 'assets/exercises/planche.png',
    category: 'Gainage',
    successCriteria: [
      'Appui sur les avant-bras et pointes de pieds',
      'Coudes sous les épaules',
      'Corps parfaitement aligné',
      'Fessiers et abdos contractés',
      'Regard vers le sol',
      'Tenir la position sans bouger'
    ],
    tips: 'Ne laissez pas les hanches monter ou descendre. Respirez calmement.'
  },

  // Fentes
  'fente': {
    id: 'fente',
    name: 'Fentes',
    level: 1,
    image: 'assets/exercises/fente.png',
    category: 'Membres inférieurs',
    successCriteria: [
      'Faire un grand pas en avant',
      'Descendre le genou arrière vers le sol',
      'Genou avant aligné avec la cheville',
      'Angle de 90° aux deux genoux',
      'Buste droit et vertical',
      'Pousser sur le talon avant pour remonter'
    ],
    tips: 'Alternez les jambes ou faites toutes les répétitions sur une jambe.'
  }
};

// Fonction pour obtenir tous les exercices
function getAllExercises() {
  return Object.values(EXERCISES_DATABASE);
}

// Fonction pour obtenir les exercices par niveau
function getExercisesByLevel(level) {
  return Object.values(EXERCISES_DATABASE).filter(ex => ex.level === level);
}

// Fonction pour obtenir un exercice aléatoire
function getRandomExercise() {
  const exercises = getAllExercises();
  return exercises[Math.floor(Math.random() * exercises.length)];
}

// Fonction pour obtenir un exercice par ID
function getExerciseById(id) {
  return EXERCISES_DATABASE[id];
}
