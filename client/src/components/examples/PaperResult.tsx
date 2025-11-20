import PaperResult from '../PaperResult';
import type { Paper } from '@shared/schema';

export default function PaperResultExample() {
  const mockPaper: Paper = {
    id: '1',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Lukasz Kaiser', 'Illia Polosukhin'],
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks in an encoder-decoder configuration. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.',
    journal: 'Neural Information Processing Systems (NeurIPS)',
    year: 2017,
    doi: '10.48550/arXiv.1706.03762',
    url: 'https://arxiv.org/pdf/1706.03762.pdf',
    field: 'Computer Science',
    publicationType: 'Conference Paper',
    citationCount: 89542,
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <PaperResult paper={mockPaper} />
    </div>
  );
}
