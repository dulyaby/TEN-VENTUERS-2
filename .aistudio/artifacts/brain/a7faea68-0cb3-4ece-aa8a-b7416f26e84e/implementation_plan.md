# Job Seeker Dashboard & Talent Pool Architecture

Mpango mkakati wa kuunda dashibodi kamili ya muomba kazi (Job Seeker) yenye vichupo maalum vya Wasifu, CV/Nyaraka, na Kazi Alizoomba, pamoja na kuwezesha waajiri/makampuni kuona na kutafuta wafanyakazi kwenye jukwaa la Ten Ventures Africa.

## User Review & Critical Decisions

> [!IMPORTANT]
> Maamuzi makuu yaliyothibitishwa na mtumiaji:
> 1. **Muundo wa Dashibodi ya Job Seeker**: Itakuwa na tab 3 kuu zilizojitenga: **Wasifu (Profile)**, **CV & Nyaraka (Resume & Documents)**, na **Maombi Yangu (My Applications)**.
> 2. **Upatikanaji wa Wasifu (Talent Pool)**: Wasifu wa waomba kazi utakuwa wazi kwa makampuni/waajiri wote waliosajiliwa na Admin wa Ten Ventures ili waweze kutafuta wafanyakazi kulingana na fani, uzoefu, na eneo.

---

## 1. Overview & Core Concept

- **Job Seeker Dashboard**: Muombaji kazi akishaingia kwenye tovuti (`dashboard.html`), badala ya kuona ukurasa tupu wa maombi pekee, anapata dashibodi kamili ya kiweledi kumwezesha:
  - Kupakia picha yake ya wasifu (Profile Photo / Avatar) yenye preview nzuri ya mduara.
  - Kujaza taarifa zake muhimu: Jina kamili, Fani / Cheo (Job Title/Headline), Namba ya simu (WhatsApp), Mahali alipo (City/Location), Kiwango cha elimu, Miaka ya uzoefu, Ujuzi mkuu (Skills), na Maelezo mafupi ya kibinafsi (Bio).
  - Kupakia CV kuu (PDF/Word) na Barua ya Utambulisho (Cover Letter / Documents) zitakazohifadhiwa na kujazwa kiotomatiki anapobofya *Apply Now* popote kwenye tovuti bila kulazimika kuchagua faili upya kila mara.
  - Kuona na kufuatilia kazi zote alizoomba (Application Status: *Pending / Reviewing / Shortlisted / Accepted*).
- **Company / Admin Talent Search (Talent Pool)**: Kwenye Dashibodi ya Kampuni (`dashboard.html`) na Admin (`admin.html`), kutaongezwa tab au sehemu ya kutafuta na kuchuja wasifu wa waombaji kazi kulingana na jina, fani, au eneo, na kupakua CV zao.

---

## 2. User Experience & Visual Design

### A. Job Seeker Tabs Navigation
Muombaji kazi ataona tab 3 safi zenye muundo wa kisasa na rangi za Ten Ventures (`#0b224d` na `#f26522`):
1. **Wasifu (Profile)**:
   - Header yenye Profile Card: Picha ya mduara, jina, cheo, eneo, asilimia ya ukamilifu wa wasifu (Profile Strength Meter).
   - Fomu ya haraka ya kuhariri: Picha ya wasifu (upload kwa kubofya au kuburuta), Jina, Cheo / Taaluma (Professional Headline), Namba ya simu, Mahali alipo (Mji / Mkoa), Kiwango cha elimu (Degree, Diploma, Certificate, etc.), Miaka ya uzoefu, Ujuzi mkuu (Skills tags), na Maelezo binafsi (Bio).
2. **CV & Nyaraka (Resume & Documents)**:
   - Eneo la kupakia CV Kuu (Primary Resume - PDF/Word) lenye muonekano wa kisasa wa drag-and-drop.
   - Onyesho la CV iliyopo (jina la faili, ukubwa, tarehe iliyopakiwa, na button ya kuipakua au kubadilisha).
   - Eneo la kuweka Barua ya Utambulisho (Default Cover Letter au Document ya ziada).
   - Kiashiria cha kwamba nyaraka hizi zitatumika kiotomatiki anapoomba kazi yoyote kwa sekunde chache (*1-Click Apply*).
3. **Maombi Yangu (My Applications)**:
   - Orodha ya kina ya kazi zote alizoomba: Nembo na jina la kampuni, cheo cha kazi, tarehe aliyoomba, na hali ya ombi lake (*New / Reviewing / Shortlisted / Accepted*).
   - Kitufe cha kuona maelezo ya kazi au kuendelea kutazama nafasi nyingine.

### B. Company / Employer Dashboard Enhancement
- Kwenye Dashibodi ya Kampuni (`dashboard.html`), kutaongezwa tab ya **Talent Pool / Waomba Kazi** inayowawezesha waajiri kuona orodha ya waomba kazi wazi, kutafuta kwa ujuzi au eneo, na kupakua CV zao kwa ajili ya usaili.

---

## 3. Key Product Decisions & Trade-Offs

- **Data Persistence**:
  - Wasifu na nyaraka za job seeker zitahifadhiwa kwenye Firestore collection ya `seekers/{uid}` au kuunganishwa moja kwa moja kwenye `users/{uid}`.
  - Faili za CV zinasomwa na kubanwa kwa `FileReader` kupitia mfumo uliopo wa `prep()` ulioundwa ndani ya `tv5/fb.js`, unaofanya kazi vizuri mtandaoni (Firebase) na katika hali ya demo/offline bila kuhitaji Firebase Storage inayolipiwa.
- **Auto-Fill & One-Click Apply**:
  - Wakati mtumiaji anapobofya *Apply Now* kwenye kazi yoyote (`careers.html` au popup/details modal), fomu ya maombi itajaza kiotomatiki:
    - Jina lake (`me.name`)
    - Barua pepe (`me.email`)
    - Namba ya simu (`seeker.phone || me.phone`)
    - Fani yake (`seeker.profession`)
    - Uzoefu wake (`seeker.experience`)
    - CV yake iliyopakiwa awali (ikiwa ipo), akihitaji anaweza pia kubadilisha faili jipya.

---

## 4. Technical Architecture & System Flow

```
┌────────────────────────────────────────────────────────┐
│                   Job Seeker User                      │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
  ┌──────────────────────┐    ┌───────────────────────────┐
  │   dashboard.html     │    │       careers.html        │
  │                      │    │                           │
  │ • Tab 1: Wasifu      │    │ • Bonyeza "Apply Now"     │
  │   (Picha, Bio, Mji)  │    │ • Auto-fill CV & Taarifa  │
  │ • Tab 2: CV/Nyaraka  │    │ • Tuma maombi papo hapo   │
  │ • Tab 3: Maombi Yangu│    └─────────────┬─────────────┘
  └──────────┬───────────┘                  │
             │                              │
             ▼                              ▼
  ┌───────────────────────────────────────────────────────┐
  │              Firestore / Mock Data Layer              │
  │   - users / seekers (Profile, Photo, Phone, CV, Doc)  │
  │   - applications (JobId, Uid, Status, CVUrl, DocUrl)  │
  └──────────────────────────┬────────────────────────────┘
                             │
                             ▼
  ┌───────────────────────────────────────────────────────┐
  │             Company & Admin Dashboards                │
  │   - Applicants (watu walioomba kazi za kampuni)      │
  │   - Talent Pool (kutafuta na kupakua wasifu wazi)    │
  └───────────────────────────────────────────────────────┘
```

---

## 5. Verification Plan

1. **Job Seeker Dashboard**:
   - Ingia kama Job Seeker, thibitisha tab 3 (Wasifu, CV & Nyaraka, Maombi Yangu).
   - Pakia picha ya wasifu, jaza taarifa za mji, elimu, ujuzi, na hifadhi.
   - Pakia CV na barua ya ziada; thibitisha faili limehifadhiwa na linaweza kupakuliwa.
2. **One-Click Apply Flow**:
   - Nenda `careers.html`, chagua kazi na ubonyeze *Apply Now*; hakikisha fomu inajaza taarifa zote zilizohifadhiwa na CV mara moja.
3. **Company / Talent Pool Access**:
   - Ingia kama Kampuni au Admin, hakikisha waomba kazi waliojiandikisha wanaonekana kwenye orodha na CV zao zinaweza kutazamwa/kupakuliwa.
4. **Build & Lint**:
   - Endesha `compile_applet` na `lint_applet` ili kuthibitisha hakuna hitilafu yoyote ya kodi.
