import { useState } from 'react';
import { CodeIcon, PlusIcon, SearchIcon, TagIcon, TrashIcon, ShareIcon, CopyIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

// Mock snippets data
const mockSnippets = [
    {
        id: 1,
        title: 'Two Sum Solution',
        code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
        language: 'javascript',
        tags: ['array', 'hash-table', 'easy'],
        createdAt: new Date('2024-01-15'),
    },
    {
        id: 2,
        title: 'Binary Search',
        code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
        language: 'python',
        tags: ['search', 'algorithm', 'medium'],
        createdAt: new Date('2024-01-20'),
    },
];

function SnippetsPage() {
    const [snippets, setSnippets] = useState(mockSnippets);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);

    const languages = ['all', 'javascript', 'python', 'java', 'cpp', 'go'];

    const filteredSnippets = snippets.filter((snippet) => {
        const matchesSearch =
            snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snippet.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snippet.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesLanguage = selectedLanguage === 'all' || snippet.language === selectedLanguage;

        return matchesSearch && matchesLanguage;
    });

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        toast.success('Code copied to clipboard!');
    };

    const deleteSnippet = (id) => {
        setSnippets(snippets.filter((s) => s.id !== id));
        toast.success('Snippet deleted!');
    };

    return (
        <div className="min-h-screen bg-base-300">
            <Navbar />

            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 animate-slide-down">
                    <div>
                        <h1 className="text-4xl font-bold gradient-text-animated flex items-center gap-3">
                            <CodeIcon className="w-10 h-10" />
                            Code Snippets
                        </h1>
                        <p className="text-base-content/70 mt-2">Save and organize your favorite code solutions</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn btn-primary gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                        <PlusIcon className="w-5 h-5" />
                        New Snippet
                    </button>
                </div>

                {/* Filters */}
                <div className="glass rounded-2xl p-6 mb-6 animate-slide-up">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                            <input
                                type="text"
                                placeholder="Search snippets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-modern pl-10 w-full"
                            />
                        </div>

                        {/* Language Filter */}
                        <div className="flex gap-2 flex-wrap">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setSelectedLanguage(lang)}
                                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${selectedLanguage === lang
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-base-200 hover:bg-base-300'
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Snippets Grid */}
                {filteredSnippets.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center animate-fade-in">
                        <CodeIcon className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No snippets found</h3>
                        <p className="text-base-content/60">Try adjusting your search or create a new snippet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredSnippets.map((snippet, index) => (
                            <div
                                key={snippet.id}
                                className="glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{snippet.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-base-content/60">
                                            <span className="badge badge-primary badge-sm">{snippet.language}</span>
                                            <span>{snippet.createdAt.toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => copyToClipboard(snippet.code)}
                                            className="btn btn-circle btn-sm btn-ghost hover:btn-primary"
                                            title="Copy code"
                                        >
                                            <CopyIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="btn btn-circle btn-sm btn-ghost hover:btn-secondary"
                                            title="Share snippet"
                                        >
                                            <ShareIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteSnippet(snippet.id)}
                                            className="btn btn-circle btn-sm btn-ghost hover:btn-error"
                                            title="Delete snippet"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Code */}
                                <div className="bg-base-300 rounded-lg p-4 mb-4 overflow-x-auto custom-scrollbar">
                                    <pre className="text-sm">
                                        <code className="font-mono">{snippet.code}</code>
                                    </pre>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {snippet.tags.map((tag) => (
                                        <span key={tag} className="badge badge-outline gap-1">
                                            <TagIcon className="w-3 h-3" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Snippet Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass rounded-2xl p-6 max-w-2xl w-full animate-scale-in">
                        <h2 className="text-2xl font-bold mb-4">New Code Snippet</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Snippet title..."
                                className="input-modern"
                            />
                            <select className="input-modern">
                                <option>JavaScript</option>
                                <option>Python</option>
                                <option>Java</option>
                                <option>C++</option>
                                <option>Go</option>
                            </select>
                            <textarea
                                placeholder="Paste your code here..."
                                className="input-modern min-h-[200px] font-mono"
                            />
                            <input
                                type="text"
                                placeholder="Tags (comma separated)..."
                                className="input-modern"
                            />
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        toast.success('Snippet saved!');
                                        setShowAddModal(false);
                                    }}
                                    className="btn btn-primary"
                                >
                                    Save Snippet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SnippetsPage;
