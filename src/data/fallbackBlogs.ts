import type { BlogDetail } from '../types/blog'

/* ---------------------------------------------------------------------------
   Static posts shown when /api/landing-page/blogs is unreachable or returns an
   empty list, so the blog never renders as a dead page. Once the dashboard has
   real posts these disappear on their own — nothing here needs deleting.

   Written to match the RES-DATA positioning (verified property + owner data,
   hit rate, deduplication, freshness) and the RES-VA outbound context the data
   feeds. `content` is the same sanitized HTML shape the API will return.
--------------------------------------------------------------------------- */

const DATA_QUALITY = { id: -1, name: 'Data Quality', slug: 'data-quality' }
const TARGETING = { id: -2, name: 'Targeting', slug: 'targeting' }
const OPERATIONS = { id: -3, name: 'Operations', slug: 'operations' }

const TEAM = {
  id: -1,
  name: 'The RES-DATA Team',
  position: 'Data Intelligence',
  image: null,
}

export const FALLBACK_BLOGS: BlogDetail[] = [
 
  {
    id: -2,
    slug: 'zip-level-targeting-beats-bigger-lists',
    title: 'Why ZIP-Level Targeting Beats Buying a Bigger List',
    excerpt:
      'More records is the most expensive way to fix a pipeline problem. Narrowing to the right few ZIPs almost always produces more contracts than doubling your volume.',
    image: '/blog-zip-level-targeting-beats-bigger-lists.png',
    category: TARGETING,
    author: TEAM,
    published_at: '2026-02-03',
    reading_minutes: 6,
    tags: ['targeting', 'market analysis', 'roi'],
    meta_title: 'Why ZIP-Level Targeting Beats Buying a Bigger List',
    meta_description:
      'Volume hides bad targeting. How to use ZIP-level signals to concentrate outbound where deals actually close.',
    content: `
<p>When deal flow stalls, the default reaction is to buy more records. It feels like progress — the pipeline number goes up, the dialer stays busy, everyone is working. But volume is the most expensive lever available, and it is usually pulled to avoid a harder question: are we calling the right places at all?</p>

<h2>Volume hides bad targeting</h2>
<p>A list twice the size with the same conversion rate produces twice the deals and twice the cost. Nothing has improved except throughput. Meanwhile a market where owners have equity, motivation, and a reason to move this year can convert several times better than the county average — and it is usually a handful of ZIPs, not a whole metro.</p>
<p>The uncomfortable math: concentrating the same spend into the right 20% of a market routinely beats doubling volume across all of it. You are not calling fewer people, you are calling fewer <em>wrong</em> people.</p>

<h2>The signals that actually separate ZIPs</h2>
<p>Not every data point that correlates with distress is worth targeting on. These are the ones that consistently move contract rates:</p>
<ul>
  <li><strong>Equity position.</strong> Owners without room to negotiate cannot take your offer, however motivated they are.</li>
  <li><strong>Tenure.</strong> Long-held properties concentrate both equity and life-stage triggers.</li>
  <li><strong>Absentee density.</strong> Out-of-state owners behave differently from owner-occupants and respond to different conversations.</li>
  <li><strong>Turnover velocity.</strong> How fast comparable properties actually trade — a proxy for whether your exit exists.</li>
  <li><strong>Competitive saturation.</strong> How hard the ZIP is already being worked by other buyers.</li>
</ul>
<p>The last one gets skipped most often and explains most of the surprises. A ZIP can look perfect on every distress metric and still convert terribly because thirty other investors reached the same conclusion from the same public data.</p>

<h2>Read the map before you buy the list</h2>
<p>The practical sequence is unglamorous. Start from your own closed deals — not your leads, your <em>closings</em> — and map them. Most operators find their contracts cluster far more tightly than their outreach does. That gap is the opportunity.</p>
<p>From there, look for ZIPs that resemble your winners on the signals above but that you are under-calling. Then size the outreach to what your team can actually work with real follow-up, because a smaller list worked three times beats a larger one worked once. Follow-up is where the deals are, and follow-up capacity is finite.</p>

<h2>Then let results redraw the map</h2>
<p>Targeting is not a decision you make once. Contract rate by ZIP, cost per contract by ZIP, and connection rate by ZIP should be reviewed on a schedule, and the map should change when they do. A market that produced last quarter can saturate in a single season.</p>
<p>This is the part most list vendors cannot help with, because they sell access to data and stop there. Deciding <em>what</em> to target and <em>why</em>, then adjusting as the numbers come in, is the difference between owning a dataset and running a data strategy.</p>
<p>If you want to see what that looks like against your own market, a custom market analysis is the fastest way to find out where your next contracts are hiding.</p>
`,
  },
   {
    id: -1,
    slug: 'why-motivated-seller-lists-arrive-dead',
    title: 'Why Most Motivated Seller Lists Are Already Dead on Arrival',
    excerpt:
      'The list you bought this morning was assembled months ago, sold to a dozen other investors, and never checked against reality. Here is what actually goes wrong between the county record and your dialer.',
    image: '/blog-why-motivated-seller-lists-arrive-dead.png',
    category: DATA_QUALITY,
    author: TEAM,
    published_at: '2026-01-14',
    reading_minutes: 7,
    tags: ['motivated sellers', 'data quality', 'skip tracing'],
    meta_title: 'Why Most Motivated Seller Lists Are Already Dead on Arrival',
    meta_description:
      'Stale records, recycled lists, and unverified phone numbers quietly destroy outbound ROI. Here is where seller data decays and how to check yours.',
    content: `
<p>Every wholesaler has had this week: you buy a fresh list of motivated sellers, load it into the dialer, and burn three days of agent time to find one person who is actually thinking about selling. The instinct is to blame the callers or the script. Usually the problem arrived before anyone picked up the phone.</p>

<h2>A list is a photograph, not a live feed</h2>
<p>Most seller lists are assembled the same way. A vendor pulls county records, layers on a few public filters — tax delinquency, absentee ownership, probate, code violations — and exports a CSV. That export is accurate at the moment it is created and starts decaying immediately.</p>
<p>By the time a typical list reaches an investor it has been through weeks of that decay, and nothing in the file tells you which rows are still true. A record that says "absentee owner, 14 months delinquent" might describe a property that sold two months ago to somebody who saw the same list you did.</p>

<h3>What actually changes between the pull and the call</h3>
<ul>
  <li><strong>Ownership.</strong> The deed transferred. You are cold-calling the previous owner about a house they no longer own.</li>
  <li><strong>Status.</strong> The delinquency was paid, the probate closed, the violation was cured. The motivation that put them on the list is gone.</li>
  <li><strong>Contact.</strong> The number disconnected, ported, or belonged to a relative in the first place.</li>
  <li><strong>Competition.</strong> The same record sold to eleven other buyers, and the owner has now been called forty times this month.</li>
</ul>

<h2>Recycled data is the quiet killer</h2>
<p>The last item deserves its own section, because it is the one nobody prices in. Static datasets get resold. The same distressed-owner records circulate through the same list vendors, get bundled into new products, and land in the same markets over and over.</p>
<p>From the seller's side this is indistinguishable from harassment, and it does exactly what you would expect: the highest-intent, most-motivated owners become the most hostile, most burned-out people in your file. Your best rows convert worst — not because the targeting was wrong, but because forty other callers got there first.</p>
<p>This is why <em>true</em> deduplication matters more than the word implies. Deduping inside your own upload is trivial. Knowing whether a record has already been worked to death across the market is a different problem, and it requires a provider that tracks distribution rather than just selling access.</p>

<h2>Hit rate is not the same as connection rate</h2>
<p>Skip tracing vendors advertise hit rates — the share of records where they returned <em>a</em> phone number. That number is easy to inflate, because a wrong number is still a returned number. A 90% hit rate that produces 30% correct numbers is worse than a 70% hit rate that produces 65%.</p>
<p>What you actually care about is the number of conversations per thousand records, and no vendor will quote you that, because it depends on data they do not measure. The only way to know is to instrument it yourself.</p>

<h2>How to audit a list before you spend agent hours on it</h2>
<p>You do not need a data team to do this. You need one afternoon and a sample.</p>
<ol>
  <li><strong>Pull 100 random rows</strong> — random, not the first hundred, which are often sorted by quality.</li>
  <li><strong>Re-verify ownership</strong> against the current county record. Anything above a 5% mismatch means the file is old.</li>
  <li><strong>Check the trigger.</strong> If a row says tax delinquent, confirm it still is. This is where stale lists fall apart fastest.</li>
  <li><strong>Dial 50 numbers and log outcomes</strong> — right party, wrong party, disconnected. That ratio is your real hit rate.</li>
  <li><strong>Cross-reference your CRM.</strong> How many of these did you already work in the last 18 months? Overlap above 15% means you are paying for your own history.</li>
</ol>
<p>Run that on any two providers side by side and the difference is usually obvious within an hour.</p>

<h2>What good data looks like instead</h2>
<p>The alternative is not a better CSV. It is a different relationship with the data: records that are re-checked on a schedule rather than exported once, suppression that survives across pulls, and a feedback loop where dial outcomes flow back and change what gets surfaced next.</p>
<p>That is the whole reason RES-DATA exists. We monitor list health continuously instead of shipping a snapshot, we track distribution so the same owners are not sold to the entire market, and we let real outreach performance — millions of actual dials — shape what we hand you next.</p>
<p>The measure of a list is not how many rows it has. It is how many conversations it produces per hour of agent time. Once you start tracking that number, most list vendors stop looking cheap.</p>
`,
  },
  {
    id: -3,
    slug: 'list-hygiene-checklist-for-outbound-teams',
    title: 'The List Hygiene Checklist Every Outbound Team Should Run Monthly',
    excerpt:
      'Suppression, dedup, DNC, and re-verification are unglamorous work that quietly decides whether your callers spend the month talking to people or to disconnected numbers.',
    image: '/blog-list-hygiene-checklist-for-outbound-teams.png',
    category: OPERATIONS,
    author: TEAM,
    published_at: '2026-02-24',
    reading_minutes: 5,
    tags: ['operations', 'compliance', 'data quality'],
    meta_title: 'The List Hygiene Checklist Every Outbound Team Should Run Monthly',
    meta_description:
      'A practical monthly routine for suppression, deduplication, DNC scrubbing, and re-verification — the maintenance that keeps connection rates from sliding.',
    content: `
<p>Connection rates rarely collapse. They slide — a point here, a point there — until a team that used to book eight conversations a day books four and nobody can say exactly when it changed. The cause is almost always maintenance that quietly stopped happening.</p>
<p>Here is the routine worth running every month.</p>

<h2>1. Rebuild suppression from every source</h2>
<p>Suppression is not one list. It is do-not-calls, prior closings, active contracts, hostile contacts, litigious flags, and anyone who asked you to stop. These live in different systems and drift apart fast.</p>
<p>Pull them into a single suppression file monthly and apply it to every pull, including the ones from providers who claim to handle it. Trust but verify — this is the cheapest possible insurance.</p>

<h2>2. Deduplicate across time, not just within the file</h2>
<p>Deduping the file you just downloaded is table stakes. The expensive duplicates are across pulls: the same owner surfacing in three separate campaigns under slightly different name spellings or a mailing address instead of a property address.</p>
<p>Match on parcel or APN where you can, not just name and address strings. Names are messy; parcels are not.</p>

<h2>3. Re-verify before re-dialing</h2>
<p>Anything older than roughly 90 days should be re-checked before it goes back into rotation — ownership first, then the trigger that made it interesting. Records that fail either check should leave the active pool rather than quietly consuming dial time.</p>

<h2>4. Scrub DNC and keep the record</h2>
<p>Run current DNC scrubbing on every campaign and retain proof of when you did it. Compliance posture is not just about avoiding penalties; documented scrubbing is what lets you move fast without arguing about it later. If you are texting as well as calling, the messaging rules are their own discipline — treat them separately.</p>

<h2>5. Grade the numbers you already have</h2>
<p>Every dial produces a signal: right party, wrong party, disconnected, voicemail, no answer. Most teams collect this and never use it. Feed those outcomes back into the record so a phone that has been wrong-party twice stops getting called a third time.</p>
<p>This one change frees more agent hours than almost anything else on the list, and it costs nothing but the discipline to log outcomes consistently.</p>

<h2>6. Review the numbers that matter</h2>
<p>Close the month by looking at four figures: conversations per hundred dials, cost per conversation, cost per contract, and the share of records that failed re-verification. That last number is your data supplier's report card. If it climbs two months running, the problem is upstream of your team.</p>

<h2>The point of the routine</h2>
<p>None of this is clever. It is maintenance, and it is the reason two teams with identical scripts and identical headcount can produce completely different months. Data quality is not a purchase — it is an operating habit, and the teams that treat it that way stop having mysterious slow quarters.</p>
`,
  },
]

/** Fallback lookup for /blogs/{slug}. */
export function findFallbackBlog(slug: string): BlogDetail | undefined {
  return FALLBACK_BLOGS.find((blog) => blog.slug === slug)
}
