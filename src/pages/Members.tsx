import React from 'react';
import akshatImage from '../../assets/akshat.png';
import apoorvImage from '../../assets/apoorv.jpeg';
import avantikaImage from '../../assets/avantika.jpeg';
import keertiImage from '../../assets/keerti.jpg';
import mahiImage from '../../assets/mahi.jpeg';
import manyaImage from '../../assets/manya.jpeg';
import sanviImage from '../../assets/sanvi.jpeg';
import shauryaImage from '../../assets/shaurya.jpeg';
import shivangImage from '../../assets/shivang.jpeg';
import shrinidhiImage from '../../assets/shrinidhi.jpeg';
import vaishnaviImage from '../../assets/vaishnavi.jpeg';

type Member = {
  name: string;
  position: string;
  className: string;
  image?: string;
};

const officeBearers: Member[] = [
  { name: 'Akshat Parmar', position: 'President', className: 'XI-A', image: akshatImage },
  { name: 'Atharv S. Negi', position: 'Secretary', className: 'XI-A' },
  { name: 'Somya', position: 'Vice President', className: 'XI-E' },
  { name: 'Shivang Dubey', position: 'Sgt. At Arms', className: 'X-C', image: shivangImage },
  { name: 'Avantika', position: 'Jt. Secretary', className: 'X-C', image: avantikaImage },
  { name: 'Ansh Raj', position: 'Treasurer', className: 'XI-D' },
];

const directors: Member[] = [
  { name: 'Rishab', position: 'Director of Awareness', className: 'XI-D' },
  { name: 'Pratkysh', position: 'Director of Awareness', className: 'XI-D' },
  { name: 'Vaishnavi', position: 'Director of Idea & Content', className: 'XII-E', image: vaishnaviImage },
  { name: 'Manya', position: 'Director of Posters', className: 'XI-E', image: manyaImage },
  { name: 'Keerti Negi', position: 'Director of Social Media', className: 'XI-E', image: keertiImage },
  { name: 'Shrinidhi Jha', position: 'Director of Photography', className: 'XI-A', image: shrinidhiImage },
  { name: 'Apoorv Sinha', position: 'Director of Communication', className: 'XI-D', image: apoorvImage },
];

const members: Member[] = [
  { name: 'Shaurya Singh', position: 'Member (Social Media)', className: 'XI-B', image: shauryaImage },
  { name: 'Shreya', position: 'Member', className: 'X-C' },
  { name: 'Mahi', position: 'Member', className: 'XII-A', image: mahiImage },
  { name: 'Sanvi Kumari', position: 'Member', className: 'XI-E', image: sanviImage },
  { name: 'Gaurav', position: 'Member', className: 'XI-B' },
  { name: 'Siddhi', position: 'Member', className: 'X-A' },
  { name: 'Mansvi', position: 'Member', className: 'IX-B' },
];

const initials = (name: string) => name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

const MemberCard: React.FC<{ member: Member; prominent?: boolean }> = ({ member, prominent = false }) => (
  <article className={`bg-white border border-slate-200 rounded-lg p-4 flex items-center gap-4 shadow-sm ${prominent ? 'md:p-5 md:gap-5' : ''}`}>
    <div className={`shrink-0 overflow-hidden rounded-full bg-blue-50 border-2 border-amber-400 flex items-center justify-center text-blue-900 font-bold ${prominent ? 'w-20 h-20 text-lg' : 'w-16 h-16 text-base'}`}>
      {member.image ? (
        <img src={member.image} alt={member.name} className="block w-full h-full object-cover object-center" />
      ) : (
        initials(member.name)
      )}
    </div>
    <div className="min-w-0">
      <h3 className="font-bold text-slate-900 text-base leading-snug">{member.name}</h3>
      <p className="text-sm font-semibold text-blue-900 mt-1">{member.position}</p>
      <p className="text-xs text-slate-500 mt-1">Class {member.className}</p>
    </div>
  </article>
);

const MemberSection: React.FC<{ title: string; roster: Member[]; prominentFirst?: boolean }> = ({ title, roster, prominentFirst = false }) => (
  <section className="bg-slate-50 border border-slate-200 rounded-xl p-5 md:p-7 space-y-5">
    <div className="flex items-center gap-3 border-b border-amber-400 pb-3">
      <span className="w-1.5 h-7 bg-amber-500 rounded-full" aria-hidden="true" />
      <h2 className="text-xl font-bold text-blue-950">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {roster.map((member, index) => <MemberCard key={`${member.position}-${member.name}`} member={member} prominent={prominentFirst && index < 2} />)}
    </div>
  </section>
);

export const Members: React.FC = () => {
  return (
    <div className="bg-white text-slate-800">
      <header className="border-b border-slate-200 bg-slate-50 px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="inline-flex bg-blue-950 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
            Create Lasting Impact
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-950 tracking-tight">Office Bearers &amp; Members</h1>
          <p className="text-sm md:text-base text-slate-600">Interact Club of Jagran Public School, Noida | Session 2026–2027</p>
          <div className="w-20 h-1 bg-amber-500 mx-auto" aria-hidden="true" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <MemberSection title="Office Bearers" roster={officeBearers} prominentFirst />
        <MemberSection title="Directors" roster={directors} />
        <MemberSection title="Members" roster={members} />
      </main>
    </div>
  );
};
