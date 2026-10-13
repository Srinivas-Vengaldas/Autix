// Edit these to change the links and names shown on the site.
export const SITE = {
  title: "Autix",
  author: "Srinivas Vengaldas",
  githubUrl: "https://github.com/Srinivas-Vengaldas/Autix",
  datasetUrl: "https://www.kaggle.com/datasets/cihan063/autism-image-data",
};

export const MODELS = [
  { id: "xception", name: "Xception", url: "/models/xception/model.json" },
  { id: "vgg19", name: "VGG19", url: "/models/vgg19/model.json" },
];

export const IMAGE_SIZE = 224; // both models expect 224 x 224 RGB, pixel values 0..255
export const THRESHOLD = 0.5;
