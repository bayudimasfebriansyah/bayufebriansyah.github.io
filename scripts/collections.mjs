export const COLLECTIONS = [
  {
    key: 'selected',
    label: 'Selected Works',
    pathname: '/',
    intro: ['Projects from Illinois MakerLab and my engineering studies.', 'Explore the decisions, test results, and limitations behind each project.']
  },
  {
    key: 'other',
    label: 'Other Works',
    pathname: '/other-works/',
    intro: ['More hands-on work from Illinois MakerLab.', 'Robot integration, client prototypes, and print planning.']
  }
];

export function collectionFor(project) {
  const key = project.collection ?? 'selected';
  const collection = COLLECTIONS.find(item => item.key === key);
  if (!collection) throw Error('Unknown project collection: ' + key);
  return collection;
}

export function nextInCollection(projects, project) {
  const key = collectionFor(project).key;
  const peers = projects.filter(item => collectionFor(item).key === key);
  const index = peers.findIndex(item => item.slug === project.slug);
  if (index < 0) throw Error('Project missing from collection: ' + project.slug);
  return peers.length > 1 ? peers[(index + 1) % peers.length] : null;
}
