import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Palette, 
  Music, 
  Camera, 
  PenTool, 
  Theater, 
  Laptop 
} from "lucide-react";
import creativeIndustriesImg from "@/assets/creative-industries.jpg";

const SectorShowcase = () => {
  const sectors = [
    {
      title: "Arts & Crafts",
      description: "Traditional and contemporary visual arts, pottery, sculpture, and handmade crafts",
      icon: Palette,
      image: creativeIndustriesImg,
      stats: "2,500+ funded projects"
    },
    {
      title: "Music & Audio", 
      description: "Recording studios, live venues, music production, and audio technology",
      icon: Music,
      image: creativeIndustriesImg,
      stats: "1,800+ funded projects"
    },
    {
      title: "Film & Photography",
      description: "Independent films, documentaries, photography studios, and video production", 
      icon: Camera,
      image: creativeIndustriesImg,
      stats: "3,200+ funded projects"
    },
    {
      title: "Design & Fashion",
      description: "Graphic design, fashion design, textile production, and digital design",
      icon: PenTool,
      image: creativeIndustriesImg,
      stats: "2,100+ funded projects" 
    },
    {
      title: "Performing Arts",
      description: "Theater, dance, comedy, and live performance venues",
      icon: Theater,
      image: creativeIndustriesImg,
      stats: "1,500+ funded projects"
    },
    {
      title: "Digital Media",
      description: "Gaming, software development, digital content, and tech innovation",
      icon: Laptop,
      image: creativeIndustriesImg,
      stats: "4,000+ funded projects"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tailored for Every Creative Industry
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform supports diverse creative sectors with specialized funding solutions, 
            expert guidance, and industry-specific resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectors.map((sector, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${sector.image}')` 
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <sector.icon className="h-12 w-12 text-white" />
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-sm font-medium">{sector.stats}</div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                  {sector.title}
                </CardTitle>
                <CardDescription>{sector.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  Explore Opportunities
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectorShowcase;