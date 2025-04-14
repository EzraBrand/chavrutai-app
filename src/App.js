import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TextDisplay from './components/text/TextDisplay';
import AnalysisPanel from './components/ai/AnalysisPanel';

// Mock data for development
const mockTalmudData = {
  tractate: "Sanhedrin",
  page: "90a",
  text: [
    "כל ישראל יש להם חלק לעולם הבא שנאמר ועמך כולם צדיקים לעולם יירשו ארץ נצר מטעי מעשה ידי להתפאר",
    "ואלו שאין להם חלק לעולם הבא האומר אין תחיית המתים מן התורה ואין תורה מן השמים ואפיקורוס",
    "רבי עקיבא אומר אף הקורא בספרים החיצונים והלוחש על המכה ואומר כל המחלה אשר שמתי במצרים לא אשים עליך כי אני ה' רופאך",
    "אבא שאול אומר אף ההוגה את השם באותיותיו"
  ],
  translation: [
    "All of Israel have a share in the World-to-Come, as it is stated: 'And your people, all of them righteous, shall inherit the land forever, the branch of My planting, the work of My hands, that I may be glorified.'",
    "And these are the ones who do not have a share in the World-to-Come: One who says that resurrection of the dead is not derived from the Torah, and one who says that the Torah was not divinely revealed, and an apikoros (heretic).",
    "Rabbi Akiva says: Even one who reads external books, and one who whispers a charm over a wound and says: 'All the illnesses that I have placed upon Egypt I will not place upon you, for I am the Lord, your healer.'",
    "Abba Shaul says: Also, one who pronounces the Divine Name as it is written."
  ]
};

const mockAnalysisData = {
  summary: [
    "This Mishnah from Tractate Sanhedrin discusses who has a share in the World-to-Come and who is excluded.",
    "It begins with the inclusive statement that all Jews have a portion in the afterlife, citing a verse from Isaiah as proof.",
    "The Mishnah then lists categories of people who forfeit their share: those who deny resurrection, those who deny divine revelation of Torah, and heretics.",
    "Additional categories are provided by Rabbi Akiva and Abba Shaul, including those who read 'external books', practice certain types of healing incantations, or pronounce God's name as it is written."
  ],
  background: [
    "This Mishnah appears at the beginning of the final chapter (Chelek) of Tractate Sanhedrin, which focuses on theological matters rather than legal procedures.",
    "The concept of 'World-to-Come' (Olam Ha-Ba) refers to the afterlife in Jewish theology, though its exact nature was debated among Jewish thinkers.",
    "The Mishnah's opening statement is traditionally recited when beginning study of Pirkei Avot (Ethics of the Fathers) on Sabbath afternoons.",
    "This text became central to discussions of Jewish theology, with Maimonides basing his 13 Principles of Faith partly on the categories of heresy mentioned here."
  ],
  "key-concepts": [
    "World-to-Come (Olam Ha-Ba): The Jewish concept of an afterlife or messianic future world.",
    "Resurrection of the Dead: A fundamental Jewish belief that the dead will be brought back to life in the messianic era.",
    "Apikoros: A term for a heretic or skeptic, derived from the Greek philosopher Epicurus.",
    "External Books: Refers to texts outside the Jewish canon, possibly including early Christian texts, Greek philosophical works, or other sectarian Jewish writings.",
    "Divine Name: The Tetragrammaton (YHWH), which according to tradition should not be pronounced as written."
  ],
  commentary: [
    "This Mishnah establishes fundamental principles of Jewish belief. By stating who loses their share in the World-to-Come, it implicitly defines the boundaries of acceptable Jewish theology.",
    "The text shows that denial of core doctrines (resurrection, divine origin of Torah) was considered more serious than most behavioral transgressions.",
    "Rabbi Akiva's addition about 'external books' may reflect tensions with early Christianity or other sectarian movements of the time.",
    "The prohibition against pronouncing the Divine Name reflects the profound reverence for God's name in Jewish tradition.",
    "Maimonides interpreted the 'apikoros' category broadly to include anyone who disparages the sages or the Torah, indicating how this text was expanded in later Jewish thought."
  ]
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <h1 className="text-2xl font-bold mb-4">Talmud Text</h1>
                <TextDisplay 
                  tractate={mockTalmudData.tractate}
                  page={mockTalmudData.page}
                  text={mockTalmudData.text}
                  translation={mockTalmudData.translation}
                />
              </div>
              
              <div className="md:w-1/2">
                <h1 className="text-2xl font-bold mb-4">AI Analysis</h1>
                <AnalysisPanel 
                  tractate={mockTalmudData.tractate}
                  page={mockTalmudData.page}
                  isLoading={isLoading}
                  analysisData={mockAnalysisData}
                />
              </div>
            </div>
          </Layout>
        } />
        <Route path="/browse" element={
          <Layout>
            <h1 className="text-2xl font-bold">Browse Texts</h1>
            <p className="mt-4">This page will contain a browsable index of Talmud texts.</p>
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <h1 className="text-2xl font-bold">About ChavrutAI</h1>
            <p className="mt-4">
              ChavrutAI brings the traditional Jewish learning partnership ("chavruta") 
              into the digital age by combining ancient texts with modern AI technology.
            </p>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;