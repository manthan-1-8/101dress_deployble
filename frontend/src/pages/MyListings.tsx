import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, TrendingUp, AlertCircle, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Item {
    id: number;
    title: string;
    brand: string;
    image: string;
    status: string;
    type?: string;
    sale_price?: number;
    rent_price?: number;
    verified?: boolean;
}

const MyListings = () => {
    const [activeTab, setActiveTab] = useState('current');
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user items (u1)
        const fetchItems = async () => {
            try {
                const res = await fetch('http://localhost:8001/api/items?seller_id=u1');
                if (res.ok) {
                    const data = await res.json();
                    setItems(data);
                }
            } catch (err) {
                console.error("Failed to fetch listings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const currentListings = items.filter(item => item.status !== 'sold' && item.status !== 'archived');
    const pastListings = items.filter(item => item.status === 'sold' || item.status === 'archived');

    // Mock interest data for specific items
    const hasInterest = (itemId: number) => {
        // Arbitrary logic: show interest for the first item in the list
        return items.length > 0 && items[0].id === itemId;
    };

    return (
        <main className="min-h-screen bg-background">
            <Header />

            <div className="container mx-auto px-6 md:px-12 pt-32 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-4">My Listings</h1>
                        <p className="text-muted-foreground">Manage your portfolio and track performance.</p>
                    </div>
                    <Link to="/sell">
                        <Button className="btn-editorial-dark">
                            + Add New Listing
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Listings Column */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="current" className="w-full" onValueChange={setActiveTab}>
                            <TabsList className="mb-8 bg-secondary/30 p-1 rounded-full w-full max-w-md">
                                <TabsTrigger value="current" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm w-1/2">Current Listings</TabsTrigger>
                                <TabsTrigger value="past" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm w-1/2">Past Listings</TabsTrigger>
                            </TabsList>

                            <TabsContent value="current" className="space-y-6">
                                {loading ? (
                                    <div className="text-center py-12 text-muted-foreground">Loading listings...</div>
                                ) : currentListings.length === 0 ? (
                                    <div className="text-center py-12 border border-dashed border-border rounded-xl">
                                        <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="font-serif text-xl mb-2">No active listings</h3>
                                        <p className="text-muted-foreground mb-6">Time to clear your closet?</p>
                                        <Link to="/sell"><Button variant="outline">List an Item</Button></Link>
                                    </div>
                                ) : (
                                    currentListings.map((item) => (
                                        <Card key={item.id} className="p-6 border-border hover:border-gold/30 transition-all duration-300">
                                            <div className="flex gap-6">
                                                <div className="w-32 h-32 flex-shrink-0 bg-muted rounded-lg overflow-hidden relative">
                                                    <img src={item.image.startsWith('http') || item.image.startsWith('/') ? item.image : `/assets/${item.image}`} alt={item.title} className="w-full h-full object-cover" />
                                                    {item.status === 'rented' && (
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                            <span className="text-white text-xs font-bold uppercase tracking-wider border border-white px-2 py-1">Rented</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="font-serif text-xl text-foreground">{item.title}</h3>
                                                            <p className="text-sm text-muted-foreground">{item.brand}</p>
                                                        </div>
                                                        <Badge variant={item.status === 'live' ? 'default' : 'secondary'} className="uppercase tracking-widest text-[10px]">
                                                            {item.status}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center gap-4 mt-4">
                                                        <div className="text-sm">
                                                            {item.sale_price && <span className="font-medium">Sale: ₹{item.sale_price.toLocaleString()}</span>}
                                                            {item.sale_price && item.rent_price && <span className="mx-2 text-muted-foreground">|</span>}
                                                            {item.rent_price && <span className="font-medium">Rent: ₹{item.rent_price}/day</span>}
                                                        </div>
                                                    </div>

                                                    {/* Interest Alert */}
                                                    {hasInterest(item.id) && (
                                                        <div className="mt-4 bg-orange-50/50 border border-orange-100 p-3 rounded-lg flex items-center justify-between gap-4">
                                                            <div className="flex items-center gap-2 text-orange-700">
                                                                <AlertCircle className="w-4 h-4" />
                                                                <span className="text-sm font-medium">1 person showed interest!</span>
                                                            </div>
                                                            <Link to="/chat">
                                                                <Button size="sm" variant="outline" className="h-8 text-xs gap-2 hover:bg-orange-50 hover:text-orange-800 border-orange-200">
                                                                    <MessageCircle className="w-3 h-3" />
                                                                    Chat
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </TabsContent>

                            <TabsContent value="past">
                                <div className="text-center py-12 text-muted-foreground bg-secondary/10 rounded-xl">
                                    <p>No past listings found.</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Trends Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            <Card className="p-6 border-border bg-card/50 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-6 text-gold">
                                    <TrendingUp className="w-5 h-5" />
                                    <h2 className="font-serif text-xl">Popular Trends</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="group cursor-pointer">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium group-hover:text-gold transition-colors">Vintage Chanel</span>
                                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">High demand for 90s flap bags.</p>
                                    </div>

                                    <div className="group cursor-pointer">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium group-hover:text-gold transition-colors">Silk Scarves</span>
                                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+8%</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Hermes & Dior patterns trending.</p>
                                    </div>

                                    <div className="group cursor-pointer">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium group-hover:text-gold transition-colors">Oversized Blazers</span>
                                            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">Stable</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Neutral tones performing best.</p>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-border">
                                    <h3 className="text-sm font-medium mb-3">Seller Tips</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Listings with 4+ photos sell 2x faster. Try adding a 'Styled With' photo to boost engagement.
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
};

export default MyListings;
