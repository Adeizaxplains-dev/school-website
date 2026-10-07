import {
  Award, Baby, BookOpen, Brain, Building2, Calculator, CalendarDays, Compass, FlaskConical,
  Globe, GraduationCap, Handshake, Heart, HeartHandshake, Landmark, Languages, Laptop,
  Leaf, Library, Lightbulb, Microscope, Music, Palette, Puzzle, School, ShieldCheck,
  Sparkles, Sprout, Star, Target, Trophy, Users, Utensils, Bus,
} from "lucide-react";

/**
 * Icons that can be referenced by name from school.config.js.
 * Only the icons listed here are bundled, which keeps the site light.
 * To add more: import the icon above and add it to this object.
 * Browse names at https://lucide.dev/icons
 */
const iconMap = {
  Award, Baby, BookOpen, Brain, Building2, Calculator, CalendarDays, Compass, FlaskConical,
  Globe, GraduationCap, Handshake, Heart, HeartHandshake, Landmark, Languages, Laptop,
  Leaf, Library, Lightbulb, Microscope, Music, Palette, Puzzle, School, ShieldCheck,
  Sparkles, Sprout, Star, Target, Trophy, Users, Utensils, Bus,
};

export function getIcon(name) {
  return iconMap[name] || School;
}
