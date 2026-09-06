import { useUser } from '@clerk/clerk-react';
import { TrophyIcon, MedalIcon, CrownIcon, TrendingUpIcon, TrendingDownIcon, Loader2Icon } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '../lib/submissions';

function LeaderboardPage() {
    const { user } = useUser();
    const [timeframe, setTimeframe] = useState('all-time');

    const { data: leaderboardData = [], isLoading } = useQuery({
        queryKey: ['leaderboard', timeframe],
        queryFn: () => getLeaderboard(timeframe === 'all-time' ? 'all' : timeframe === 'week' ? 'weekly' : timeframe === 'month' ? 'monthly' : 'daily'),
    });

    const getRankIcon = (rank) => {
        if (rank === 1) return <CrownIcon className="w-6 h-6 text-yellow-500" />;
        if (rank === 2) return <MedalIcon className="w-6 h-6 text-gray-400" />;
        if (rank === 3) return <MedalIcon className="w-6 h-6 text-amber-700" />;
        return null;
    };

    return (
        <div className="min-h-screen bg-base-300">
            <Navbar />

            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="text-center mb-8 animate-slide-down">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <TrophyIcon className="w-12 h-12 text-primary" />
                        <h1 className="text-4xl font-bold gradient-text-animated">Leaderboard</h1>
                    </div>
                    <p className="text-base-content/70 text-lg">Compete with the best coders worldwide</p>
                </div>

                {/* Filters */}
                <div className="glass rounded-2xl p-6 mb-6 animate-slide-up">
                    <div className="flex flex-wrap gap-4 justify-center">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Timeframe</label>
                            <div className="flex gap-2">
                                {['today', 'week', 'month', 'all-time'].map((tf) => (
                                    <button
                                        key={tf}
                                        onClick={() => setTimeframe(tf)}
                                        className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${timeframe === tf
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-base-200 hover:bg-base-300'
                                            }`}
                                    >
                                        {tf.replace('-', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2Icon className="w-12 h-12 animate-spin text-primary" />
                    </div>
                ) : leaderboardData.length === 0 ? (
                    <div className="text-center py-20 bg-base-100 rounded-2xl shadow-sm border border-base-300">
                        <TrophyIcon className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                        <h2 className="text-2xl font-bold text-base-content/70">No rankings yet</h2>
                        <p className="text-base-content/50">Be the first to submit a solution!</p>
                    </div>
                ) : (
                    <>
                        {/* Top 3 Podium */}
                        {leaderboardData.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto items-end">
                                {/* 2nd Place */}
                                {leaderboardData[1] && (
                                    <div className="flex flex-col items-center animate-slide-in-left order-2 md:order-1" style={{ animationDelay: '0.1s' }}>
                                        <div className="glass rounded-2xl p-6 w-full text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 bg-base-300 rounded-bl-xl font-bold text-base-content/50">#2</div>
                                            <div className="w-20 h-20 mx-auto mb-3 rounded-full border-4 border-gray-400 overflow-hidden">
                                                <img src={leaderboardData[1].userId?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${leaderboardData[1].userId?.name}`} alt={leaderboardData[1].userId?.name} className="w-full h-full object-cover" />
                                            </div>
                                            <MedalIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <h3 className="font-bold text-lg truncate w-full">{leaderboardData[1].userId?.name || 'Unknown'}</h3>
                                            <p className="text-2xl font-bold text-primary mt-2">{leaderboardData[1].totalPoints}</p>
                                            <p className="text-sm text-base-content/60">{leaderboardData[1].problemsSolved} problems</p>
                                        </div>
                                    </div>
                                )}

                                {/* 1st Place */}
                                {leaderboardData[0] && (
                                    <div className="flex flex-col items-center animate-slide-up order-1 md:order-2 -mt-8 md:-mt-0" style={{ animationDelay: '0s' }}>
                                        <div className="glass rounded-2xl p-8 w-full text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-2 border-yellow-500 relative overflow-hidden transform scale-105">
                                            <div className="absolute top-0 right-0 p-2 bg-yellow-500/20 rounded-bl-xl font-bold text-yellow-600">#1</div>
                                            <div className="w-24 h-24 mx-auto mb-3 rounded-full border-4 border-yellow-500 overflow-hidden shadow-lg shadow-yellow-500/20">
                                                <img src={leaderboardData[0].userId?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${leaderboardData[0].userId?.name}`} alt={leaderboardData[0].userId?.name} className="w-full h-full object-cover" />
                                            </div>
                                            <CrownIcon className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
                                            <h3 className="font-bold text-xl truncate w-full">{leaderboardData[0].userId?.name || 'Unknown'}</h3>
                                            <p className="text-3xl font-bold gradient-text mt-2">{leaderboardData[0].totalPoints}</p>
                                            <p className="text-sm text-base-content/60">{leaderboardData[0].problemsSolved} problems</p>
                                        </div>
                                    </div>
                                )}

                                {/* 3rd Place */}
                                {leaderboardData[2] && (
                                    <div className="flex flex-col items-center animate-slide-in-right order-3" style={{ animationDelay: '0.2s' }}>
                                        <div className="glass rounded-2xl p-6 w-full text-center hover-lift relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 bg-base-300 rounded-bl-xl font-bold text-base-content/50">#3</div>
                                            <div className="w-20 h-20 mx-auto mb-3 rounded-full border-4 border-amber-700 overflow-hidden">
                                                <img src={leaderboardData[2].userId?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${leaderboardData[2].userId?.name}`} alt={leaderboardData[2].userId?.name} className="w-full h-full object-cover" />
                                            </div>
                                            <MedalIcon className="w-8 h-8 text-amber-700 mx-auto mb-2" />
                                            <h3 className="font-bold text-lg truncate w-full">{leaderboardData[2].userId?.name || 'Unknown'}</h3>
                                            <p className="text-2xl font-bold text-primary mt-2">{leaderboardData[2].totalPoints}</p>
                                            <p className="text-sm text-base-content/60">{leaderboardData[2].problemsSolved} problems</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Full Leaderboard Table */}
                        <div className="glass rounded-2xl overflow-hidden animate-fade-in">
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead className="bg-base-200">
                                        <tr>
                                            <th className="text-center">Rank</th>
                                            <th>User</th>
                                            <th className="text-center">Problems Solved</th>
                                            <th className="text-center">Score</th>
                                            <th className="text-center">Streak</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboardData.map((entry, index) => (
                                            <tr
                                                key={entry._id}
                                                className={`hover:bg-base-200 transition-colors ${user?.id === entry.userId?.clerkId ? 'bg-primary/10' : ''
                                                    }`}
                                            >
                                                <td className="text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {getRankIcon(index + 1)}
                                                        <span className="font-bold text-lg">{index + 1}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden">
                                                            <img src={entry.userId?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.userId?.name}`} alt={entry.userId?.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold">{entry.userId?.name || 'Unknown'}</div>
                                                            {user?.id === entry.userId?.clerkId && (
                                                                <span className="badge badge-primary badge-sm">You</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center font-semibold">{entry.problemsSolved}</td>
                                                <td className="text-center">
                                                    <span className="font-bold text-primary text-lg">{entry.totalPoints}</span>
                                                </td>
                                                <td className="text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <span className="font-bold text-orange-500">🔥 {entry.streak}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default LeaderboardPage;
