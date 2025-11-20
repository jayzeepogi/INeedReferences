import ResultsList from '../ResultsList';
import type { Paper } from '@shared/schema';

export default function ResultsListExample() {
  const mockPapers: Paper[] = [
    {
      id: '1',
      title: 'Deep Learning for Computer Vision: A Brief Review',
      authors: ['John Smith', 'Jane Doe'],
      abstract: 'This paper provides a comprehensive review of deep learning techniques applied to computer vision tasks. We discuss convolutional neural networks, object detection, image segmentation, and recent advances in the field.',
      journal: 'IEEE Transactions on Pattern Analysis and Machine Intelligence',
      year: 2023,
      doi: '10.1109/TPAMI.2023.123456',
      url: 'https://arxiv.org/pdf/example.pdf',
      field: 'Computer Science',
      publicationType: 'Journal Article',
      citationCount: 245,
    },
    {
      id: '2',
      title: 'Quantum Computing: Current State and Future Perspectives',
      authors: ['Alice Johnson', 'Bob Williams', 'Charlie Brown'],
      abstract: 'We examine the current state of quantum computing technology and its potential applications in cryptography, optimization, and machine learning. The paper discusses major challenges and promising research directions.',
      journal: 'Nature Physics',
      year: 2024,
      doi: '10.1038/nphys.2024.001',
      url: 'https://www.nature.com/articles/example.pdf',
      field: 'Physics',
      publicationType: 'Review Article',
      citationCount: 89,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4">
      <ResultsList 
        papers={mockPapers} 
        totalCount={234} 
        currentPage={1} 
        resultsPerPage={10} 
      />
    </div>
  );
}
