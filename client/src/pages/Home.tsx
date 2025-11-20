import { useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import FilterPanel, { type Filters } from "@/components/FilterPanel";
import ResultsList from "@/components/ResultsList";
import Pagination from "@/components/Pagination";
import Footer from "@/components/Footer";
import UrlToCitation from "@/components/UrlToCitation";
import { Separator } from "@/components/ui/separator";
import type { Paper } from "@shared/schema";

// TODO: remove mock functionality
const mockPapers: Paper[] = [
  {
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
  },
  {
    id: '2',
    title: 'Deep Residual Learning for Image Recognition',
    authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
    abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions. We provide comprehensive empirical evidence showing that these residual networks are easier to optimize, and can gain accuracy from considerably increased depth.',
    journal: 'IEEE Conference on Computer Vision and Pattern Recognition (CVPR)',
    year: 2016,
    doi: '10.1109/CVPR.2016.90',
    url: 'https://arxiv.org/pdf/1512.03385.pdf',
    field: 'Computer Science',
    publicationType: 'Conference Paper',
    citationCount: 154289,
  },
  {
    id: '3',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee', 'Kristina Toutanova'],
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.',
    journal: 'North American Chapter of the Association for Computational Linguistics (NAACL)',
    year: 2019,
    doi: '10.18653/v1/N19-1423',
    url: 'https://arxiv.org/pdf/1810.04805.pdf',
    field: 'Computer Science',
    publicationType: 'Conference Paper',
    citationCount: 67234,
  },
  {
    id: '4',
    title: 'Generative Adversarial Networks',
    authors: ['Ian Goodfellow', 'Jean Pouget-Abadie', 'Mehdi Mirza', 'Bing Xu', 'David Warde-Farley', 'Sherjil Ozair', 'Aaron Courville', 'Yoshua Bengio'],
    abstract: 'We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G. The training procedure for G is to maximize the probability of D making a mistake.',
    journal: 'Neural Information Processing Systems (NeurIPS)',
    year: 2014,
    doi: '10.48550/arXiv.1406.2661',
    url: 'https://arxiv.org/pdf/1406.2661.pdf',
    field: 'Computer Science',
    publicationType: 'Conference Paper',
    citationCount: 54123,
  },
  {
    id: '5',
    title: 'ImageNet Classification with Deep Convolutional Neural Networks',
    authors: ['Alex Krizhevsky', 'Ilya Sutskever', 'Geoffrey E. Hinton'],
    abstract: 'We trained a large, deep convolutional neural network to classify the 1.2 million high-resolution images in the ImageNet LSVRC-2010 contest into the 1000 different classes. On the test data, we achieved top-1 and top-5 error rates of 37.5% and 17.0% which is considerably better than the previous state-of-the-art.',
    journal: 'Neural Information Processing Systems (NeurIPS)',
    year: 2012,
    doi: '10.1145/3065386',
    url: 'https://papers.nips.cc/paper_files/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf',
    field: 'Computer Science',
    publicationType: 'Conference Paper',
    citationCount: 98765,
  },
  {
    id: '6',
    title: 'Quantum Supremacy Using a Programmable Superconducting Processor',
    authors: ['Frank Arute', 'Kunal Arya', 'Ryan Babbush', 'Dave Bacon', 'Joseph C. Bardin'],
    abstract: 'The promise of quantum computers is that certain computational tasks might be executed exponentially faster on a quantum processor than on a classical processor. A fundamental challenge is to build a high-fidelity processor capable of running quantum algorithms in an exponentially large computational space.',
    journal: 'Nature',
    year: 2019,
    doi: '10.1038/s41586-019-1666-5',
    url: 'https://www.nature.com/articles/s41586-019-1666-5.pdf',
    field: 'Physics',
    publicationType: 'Journal Article',
    citationCount: 5432,
  },
  {
    id: '7',
    title: 'CRISPR-Cas9 Gene Editing: Applications and Future Directions',
    authors: ['Jennifer A. Doudna', 'Emmanuelle Charpentier'],
    abstract: 'The development of the CRISPR-Cas9 system has revolutionized genome editing. We review the molecular mechanisms, applications in basic research and therapeutics, and discuss future directions for this powerful technology.',
    journal: 'Science',
    year: 2014,
    doi: '10.1126/science.1258096',
    url: 'https://www.science.org/doi/pdf/10.1126/science.1258096',
    field: 'Biology',
    publicationType: 'Review Article',
    citationCount: 12345,
  },
  {
    id: '8',
    title: 'The Structure and Function of the Human Microbiome',
    authors: ['Curtis Huttenhower', 'Dirk Gevers', 'Rob Knight', 'Sahar Abubucker'],
    abstract: 'Studies of the human microbiome have revealed that even healthy individuals differ remarkably in the microbes that occupy habitats such as the gut, skin and vagina. Much of this diversity remains unexplained, although diet, environment, host genetics and early microbial exposure have all been implicated.',
    journal: 'Nature',
    year: 2012,
    doi: '10.1038/nature11234',
    url: 'https://www.nature.com/articles/nature11234.pdf',
    field: 'Biology',
    publicationType: 'Journal Article',
    citationCount: 8765,
  },
  {
    id: '9',
    title: 'Climate Change and Global Warming: Evidence and Future Projections',
    authors: ['Michael E. Mann', 'Raymond S. Bradley', 'Malcolm K. Hughes'],
    abstract: 'We present an analysis of proxy-based reconstructions of hemispheric-scale temperature changes over the past millennium. Our results suggest that recent warmth is unprecedented in at least the past millennium, and that recent warming is likely due to anthropogenic greenhouse gas emissions.',
    journal: 'Geophysical Research Letters',
    year: 1999,
    doi: '10.1029/1999GL900070',
    url: 'https://agupubs.onlinelibrary.wiley.com/doi/pdf/10.1029/1999GL900070',
    field: 'Environmental Science',
    publicationType: 'Journal Article',
    citationCount: 6543,
  },
  {
    id: '10',
    title: 'Neural Networks and Deep Learning: A Textbook Overview',
    authors: ['Yann LeCun', 'Yoshua Bengio', 'Geoffrey Hinton'],
    abstract: 'Deep learning allows computational models that are composed of multiple processing layers to learn representations of data with multiple levels of abstraction. These methods have dramatically improved the state-of-the-art in speech recognition, visual object recognition, object detection and many other domains.',
    journal: 'Nature',
    year: 2015,
    doi: '10.1038/nature14539',
    url: 'https://www.nature.com/articles/nature14539.pdf',
    field: 'Computer Science',
    publicationType: 'Review Article',
    citationCount: 45678,
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    yearFrom: 'any',
    yearTo: 'any',
    field: 'all',
    publicationType: 'all',
  });

  const resultsPerPage = 10;
  const totalResults = mockPapers.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setHasSearched(true);
    setCurrentPage(1);
    console.log('Searching for:', query);
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
    console.log('Filter changed:', key, value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // TODO: remove mock functionality - filter papers based on actual backend data
  const paginatedPapers = mockPapers.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <SearchBar onSearch={handleSearch} />
          
          <div className="mt-6">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          </div>

          <div className="mt-8">
            <UrlToCitation />
          </div>

          <Separator className="my-8" />

          {hasSearched && (
            <>
              <div className="mt-8">
                <ResultsList
                  papers={paginatedPapers}
                  totalCount={totalResults}
                  currentPage={currentPage}
                  resultsPerPage={resultsPerPage}
                />
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}

          {!hasSearched && (
            <div className="mt-16 text-center text-muted-foreground">
              <p className="text-lg">Enter keywords to search millions of academic papers</p>
              <p className="mt-2">Use filters to narrow your search by year, field, or publication type</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
