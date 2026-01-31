import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutSection from '@/components/AboutSection';
import ExclusiveFeatures from '@/components/ExclusiveFeatures';

const AboutPage = () => {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="pt-24">
                <AboutSection />
                <div className="container mx-auto px-6 md:px-12 pb-24 mt-24">
                    <div className="bg-secondary/20 rounded-3xl p-10 md:p-16 border border-border">
                        <h3 className="font-serif text-3xl mb-8 text-center">The 101 Handover Process</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { title: 'Curation', desc: 'Every item is physically inspected by our experts for quality and authenticity.' },
                                { title: 'Restoration', desc: 'Minor imperfections are addressed to ensure you receive pieces in pristine condition.' },
                                { title: 'Confidence', desc: 'Our dual-escrow system ensures both buyer and seller are protected until handover.' }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-4">
                                    <div className="text-4xl font-serif text-foreground/80 italic">0{idx + 1}</div>
                                    <h4 className="font-serif text-xl">{item.title}</h4>
                                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <ExclusiveFeatures />
            </div>
            <Footer />
        </main>
    );
};

export default AboutPage;
