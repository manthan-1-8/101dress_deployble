import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShieldCheck,
  Plus,
  Settings,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  trust_score: number;
  wallet_balance: number;
  escrow_balance: number;
  avatar: string;
}

interface Item {
  id: number;
  title: string;
  brand: string;
  image: string;
  status: string;
  type?: string; // e.g. 'sale', 'rent', 'both'
  sale_price?: number;
  rent_price?: number;
}

interface Order {
  id: number;
  type: string;
  status: string;
  item: Item;
  escrow_amount: number;
  days_remaining?: number;
}

const fetchUser = async (): Promise<User> => {
  // Mock user data - replace with actual API call
  return {
    id: 'u1',
    name: 'Adhitya Chandel',
    trust_score: 92,
    wallet_balance: 45000,
    escrow_balance: 12500,
    avatar: 'https://i.pravatar.cc/150?u=u1',
  };
};

const fetchUserItems = async (): Promise<Item[]> => {
  const response = await fetch('http://localhost:8001/api/items');
  if (!response.ok) throw new Error('Failed to fetch items');
  const items = await response.json();
  return items.slice(0, 4); // Mock user items
};

const fetchUserOrders = async (): Promise<Order[]> => {
  const response = await fetch('http://localhost:8001/api/orders?user_id=u1');
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  const { data: items = [] } = useQuery({
    queryKey: ['user-items'],
    queryFn: fetchUserItems,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['user-orders'],
    queryFn: fetchUserOrders,
  });

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 md:px-12 pt-32 pb-20">
          <div className="text-center">
            <h1 className="font-serif text-4xl mb-4">Please Sign In</h1>
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const filteredItems = items
    .filter((item) => {
      if (filterType === 'all') return true;
      // specific logic: if item.type is 'both', it shows in both buy and rent filters
      // if item.type matches the filter exactly
      if (item.type === 'both') return true;
      return item.type === filterType;
    })
    .sort((a, b) => {
      if (sortOrder === 'default') return 0;

      const priceA = a.sale_price || a.rent_price || 0;
      const priceB = b.sale_price || b.rent_price || 0;

      if (sortOrder === 'price-asc') return priceA - priceB;
      if (sortOrder === 'price-desc') return priceB - priceA;
      return 0;
    });

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 md:px-12 pt-32 pb-20">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-gold"
            />
            <div className="flex-1">
              <h1 className="font-serif text-4xl lg:text-5xl font-light text-foreground mb-2">
                {user.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium">
                    Trust Score: {user.trust_score}/100
                  </span>
                </div>
                <Badge variant="outline">Verified Seller</Badge>
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Wallet Cards */}
          <div className="max-w-md">
            <Card className="p-6 bg-gradient-to-br from-secondary/50 to-secondary/20 border-border">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-serif text-lg font-medium">Escrow Balance</h3>
              </div>
              <p className="text-3xl font-medium text-foreground">
                ₹{user.escrow_balance.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Funds held for active transactions
              </p>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-1 gap-8">
              {/* Recent Orders */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-serif text-2xl font-medium">Recent Orders</h3>
                  <Button size="sm" variant="ghost">
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <Card key={order.id} className="p-4 border-border hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        <img
                          src={order.item.image}
                          alt={order.item.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{order.item.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="capitalize">
                              {order.type}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {order.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          {order.days_remaining && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {order.days_remaining} days remaining
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>


          {/* Orders Tab */}
          <TabsContent value="orders">
            <h3 className="font-serif text-2xl font-medium mb-6">Order History</h3>
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-6 border-border">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={order.item.image}
                      alt={order.item.title}
                      className="w-full md:w-32 aspect-[3/4] object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-serif text-xl font-medium">
                            {order.item.title}
                          </h4>
                          <p className="text-muted-foreground">{order.item.brand}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className="capitalize">{order.type}</Badge>
                          <Badge variant="outline" className="capitalize">
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Escrow Amount
                          </p>
                          <p className="font-medium">
                            ₹{order.escrow_amount.toLocaleString()}
                          </p>
                        </div>
                        {order.days_remaining && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Days Remaining
                            </p>
                            <p className="font-medium">{order.days_remaining}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3 mt-4">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact Seller
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </main>
  );
};

export default Profile;
