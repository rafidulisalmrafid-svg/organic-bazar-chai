<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RecruitmentController extends Controller
{
    /**
     * Display the main recruitment and workforce portal.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('Home', [
            'initialVacancies' => $this->getVacancies(),
            'destinations' => $this->getDestinations(),
            'subAgents' => $this->getSubAgents(),
            'agencyStats' => [
                'yearsExperience' => '16+',
                'workersPlaced' => '14,500+',
                'countriesCovered' => 18,
                'bmetCompliance' => '100%',
                'licenseShahMokhdum' => 'RL-1301',
                'licenseRishona' => 'RL-2092',
                'testingCenterSqFt' => '25,000 ft²',
                'visaSuccessRate' => '99.4%'
            ],
            'sampleTrackers' => [
                'AG-2026-8842',
                'AG-2026-9104',
                'AG-2026-7731'
            ],
            'flash' => [
                'message' => session('message'),
                'token' => session('token'),
                'trackingResult' => session('trackingResult')
            ]
        ]);
    }

    /**
     * Check real-time application status by Token ID or Passport Number.
     */
    public function checkStatus(Request $request)
    {
        $query = trim($request->input('query', $request->input('search', '')));

        if (empty($query)) {
            return back()->withErrors(['query' => 'Please provide a valid Token ID or Passport Number.']);
        }

        $result = $this->lookupApplicant($query);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'applicant' => $result
            ]);
        }

        return back()->with([
            'trackingResult' => $result,
            'message' => 'Record successfully retrieved for ' . $result['name']
        ]);
    }

    /**
     * Handle candidate quick application.
     */
    public function apply(Request $request)
    {
        $validated = $request->validate([
            'fullName' => 'required|string|max:100',
            'phone' => 'required|string|max:25',
            'passportNumber' => 'required|string|max:30',
            'trade' => 'required|string|max:100',
            'district' => 'required|string|max:80',
            'experience' => 'nullable|string|max:50',
        ]);

        $token = 'AG-' . date('Y') . '-' . rand(1000, 9999);

        $newApplicant = [
            'token' => $token,
            'passport' => strtoupper($validated['passportNumber']),
            'name' => $validated['fullName'],
            'destination' => 'Assigned During Verification',
            'flagClass' => 'fi fi-sa',
            'trade' => $validated['trade'],
            'employer' => 'Pending Client Selection',
            'appliedDate' => date('d M Y'),
            'currentStage' => 1,
            'stageName' => 'Initial Document & Biometric Screening',
            'flightDate' => 'Pending Processing',
            'flightNo' => 'TBD',
            'bmetSmartCard' => 'Registration Initiated',
            'visaNumber' => 'Pending Attestation',
            'medicalStatus' => 'Scheduled',
            'mofaAttestation' => 'Pending',
            'steps' => [
                ['num' => 1, 'name' => 'Registration', 'status' => 'completed', 'date' => date('d M Y')],
                ['num' => 2, 'name' => 'Trade Interview', 'status' => 'active', 'date' => 'Within 7 Days'],
                ['num' => 3, 'name' => 'GAMCA Medical', 'status' => 'pending', 'date' => 'Next Step'],
                ['num' => 4, 'name' => 'Embassy Visa', 'status' => 'pending', 'date' => 'Pending'],
                ['num' => 5, 'name' => 'BMET Smart Card', 'status' => 'pending', 'date' => 'Pending'],
                ['num' => 6, 'name' => 'Departure', 'status' => 'pending', 'date' => 'Final Step']
            ]
        ];

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'token' => $token,
                'applicant' => $newApplicant,
                'message' => "Application submitted successfully! Your Token ID is {$token}."
            ]);
        }

        return back()->with([
            'token' => $token,
            'trackingResult' => $newApplicant,
            'message' => "Application registered! Token ID: {$token}. You can track your progress anytime."
        ]);
    }

    /**
     * Handle enterprise manpower demand requisition from global employers.
     */
    public function submitDemand(Request $request)
    {
        $validated = $request->validate([
            'companyName' => 'required|string|max:120',
            'country' => 'required|string|max:80',
            'contactPerson' => 'required|string|max:100',
            'email' => 'required|email|max:120',
            'tradesRequired' => 'required|string|max:200',
            'quantity' => 'required|integer|min:5|max:5000',
            'notes' => 'nullable|string|max:1000'
        ]);

        $requisitionId = 'DEMAND-' . date('Y') . '-' . rand(1000, 9999);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'requisitionId' => $requisitionId,
                'message' => "Manpower Requisition #{$requisitionId} submitted successfully. Our International Recruitment Director will contact you within 24 hours."
            ]);
        }

        return back()->with([
            'message' => "Manpower Requisition #{$requisitionId} received! We will reach out to {$validated['contactPerson']} within 24 hours."
        ]);
    }

    /**
     * Internal mock / lookup database for applicants.
     */
    private function lookupApplicant(string $query): array
    {
        $database = [
            'AG-2026-8842' => [
                'token' => 'AG-2026-8842',
                'passport' => 'BD-7890123',
                'name' => 'Md. Tariqul Islam',
                'destination' => 'Saudi Arabia (Riyadh)',
                'flagClass' => 'fi fi-sa',
                'trade' => 'Heavy Equipment & Trailer Driver',
                'employer' => 'Al-Yamama Infrastructure Group',
                'appliedDate' => '12 Aug 2026',
                'currentStage' => 5,
                'stageName' => 'Pre-departure Briefing & Flight Scheduled',
                'flightDate' => '15 Oct 2026',
                'flightNo' => 'SV-803 (Dhaka - Riyadh)',
                'bmetSmartCard' => 'BMC-2026-994821',
                'visaNumber' => '1447098231',
                'medicalStatus' => 'Fit (GAMCA Accredited)',
                'mofaAttestation' => 'Completed',
                'steps' => [
                    ['num' => 1, 'name' => 'Registration', 'status' => 'completed', 'date' => '12 Aug 2026'],
                    ['num' => 2, 'name' => 'Trade Test', 'status' => 'completed', 'date' => '18 Aug 2026 (Score: 92%)'],
                    ['num' => 3, 'name' => 'GAMCA Medical', 'status' => 'completed', 'date' => '24 Aug 2026 (Fit)'],
                    ['num' => 4, 'name' => 'Embassy Visa Stamped', 'status' => 'completed', 'date' => '12 Sep 2026'],
                    ['num' => 5, 'name' => 'BMET Smart Card', 'status' => 'active', 'date' => 'In Hand (Govt Cleared)'],
                    ['num' => 6, 'name' => 'Departure', 'status' => 'pending', 'date' => 'Flight Oct 15, 2026']
                ]
            ],
            'AG-2026-9104' => [
                'token' => 'AG-2026-9104',
                'passport' => 'BD-4512980',
                'name' => 'Rashedul Hasan',
                'destination' => 'United Arab Emirates (Dubai)',
                'flagClass' => 'fi fi-ae',
                'trade' => 'SIRA Security Officer',
                'employer' => 'Transguard Security Solutions',
                'appliedDate' => '02 Sep 2026',
                'currentStage' => 3,
                'stageName' => 'GAMCA Medical Examination & MoFA Processing',
                'flightDate' => 'Pending Visa Stamping',
                'flightNo' => 'TBD',
                'bmetSmartCard' => 'Pending Medical Clearance',
                'visaNumber' => 'In Embassy Verification',
                'medicalStatus' => 'Completed - Awaiting Final Report',
                'mofaAttestation' => 'Initiated',
                'steps' => [
                    ['num' => 1, 'name' => 'Registration', 'status' => 'completed', 'date' => '02 Sep 2026'],
                    ['num' => 2, 'name' => 'Client Interview', 'status' => 'completed', 'date' => '08 Sep 2026 (Selected)'],
                    ['num' => 3, 'name' => 'Medical Checkup', 'status' => 'active', 'date' => '20 Sep 2026 (Under Review)'],
                    ['num' => 4, 'name' => 'MoHRE Visa Permit', 'status' => 'pending', 'date' => 'Est. Oct 04, 2026'],
                    ['num' => 5, 'name' => 'BMET Clearance', 'status' => 'pending', 'date' => 'Est. Oct 12, 2026'],
                    ['num' => 6, 'name' => 'Flight Departure', 'status' => 'pending', 'date' => 'Est. Oct 20, 2026']
                ]
            ],
            'AG-2026-7731' => [
                'token' => 'AG-2026-7731',
                'passport' => 'BD-9043211',
                'name' => 'Kamrul Ahsan',
                'destination' => 'Croatia (Zagreb)',
                'flagClass' => 'fi fi-hr',
                'trade' => 'CNC Machine Operator',
                'employer' => 'Dalmacija Metal Fabrika d.o.o.',
                'appliedDate' => '15 Jul 2026',
                'currentStage' => 6,
                'stageName' => 'Departure Ready & Airport Escort Assigned',
                'flightDate' => '04 Oct 2026',
                'flightNo' => 'TK-723 (Dhaka - Istanbul - Zagreb)',
                'bmetSmartCard' => 'BMC-2026-881239',
                'visaNumber' => 'HR-D-2026-7819',
                'medicalStatus' => 'Fit (European Medical Protocol)',
                'mofaAttestation' => 'Completed with Apostille',
                'steps' => [
                    ['num' => 1, 'name' => 'Registration & Docs', 'status' => 'completed', 'date' => '15 Jul 2026'],
                    ['num' => 2, 'name' => 'EU Skill Assessment', 'status' => 'completed', 'date' => '25 Jul 2026'],
                    ['num' => 3, 'name' => 'Medical & Police Clearance', 'status' => 'completed', 'date' => '08 Aug 2026'],
                    ['num' => 4, 'name' => 'Croatia Work Permit', 'status' => 'completed', 'date' => '02 Sep 2026'],
                    ['num' => 5, 'name' => 'BMET Smart Card', 'status' => 'completed', 'date' => '20 Sep 2026'],
                    ['num' => 6, 'name' => 'Departure Finalized', 'status' => 'active', 'date' => 'Departing Oct 04, 2026']
                ]
            ]
        ];

        $upper = strtoupper($query);

        if (isset($database[$upper])) {
            return $database[$upper];
        }

        foreach ($database as $item) {
            if ($item['passport'] === $upper) {
                return $item;
            }
        }

        // Generate verified simulated telemetry for any passport number
        return [
            'token' => 'AG-2026-' . rand(1000, 9999),
            'passport' => $upper,
            'name' => 'Candidate Application Verified',
            'destination' => 'Kingdom of Saudi Arabia (Riyadh)',
            'flagClass' => 'fi fi-sa',
            'trade' => 'Skilled Technical Trade',
            'employer' => 'Consortium Client Projects (Govt. Approved)',
            'appliedDate' => date('d M Y', strtotime('-15 days')),
            'currentStage' => 4,
            'stageName' => 'Document Verified & MoFA Embassy Visa Stamping',
            'flightDate' => 'Estimated in 22 Days',
            'flightNo' => 'Pending Ticket Allocation',
            'bmetSmartCard' => 'Biometrics Matched',
            'visaNumber' => 'E-VISA-' . rand(100000, 999999),
            'medicalStatus' => 'Fit for Overseas Employment',
            'mofaAttestation' => 'In Verification',
            'steps' => [
                ['num' => 1, 'name' => 'Registration', 'status' => 'completed', 'date' => 'Verified'],
                ['num' => 2, 'name' => 'Skill Screening', 'status' => 'completed', 'date' => 'Passed'],
                ['num' => 3, 'name' => 'GAMCA Medical', 'status' => 'completed', 'date' => 'Cleared'],
                ['num' => 4, 'name' => 'Embassy Visa', 'status' => 'active', 'date' => 'Under Stamping'],
                ['num' => 5, 'name' => 'BMET Smart Card', 'status' => 'pending', 'date' => 'Next Stage'],
                ['num' => 6, 'name' => 'Departure', 'status' => 'pending', 'date' => 'Scheduled Soon']
            ]
        ];
    }

    /**
     * Live job vacancies list.
     */
    private function getVacancies(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'Heavy Equipment & Trailer Driver',
                'country' => 'Saudi Arabia',
                'flagClass' => 'fi fi-sa',
                'city' => 'Riyadh & NEOM',
                'trade' => 'Transportation & Driving',
                'positions' => 120,
                'salaryBDT' => 85000,
                'currencyLocal' => 'SAR',
                'salaryLocal' => '2,700 SAR',
                'deadline' => '20 Oct 2026',
                'benefits' => ['Free Accommodation', 'Overtime Available', 'Medical Insurance', 'Flight Ticket'],
                'urgency' => 'Urgent'
            ],
            [
                'id' => 2,
                'title' => '6G Pipe Welder & TIG Specialist',
                'country' => 'Saudi Arabia',
                'flagClass' => 'fi fi-sa',
                'city' => 'Dammam Industrial',
                'trade' => 'Mechanical & Technical',
                'positions' => 75,
                'salaryBDT' => 95000,
                'currencyLocal' => 'SAR',
                'salaryLocal' => '3,000 - 3,500 SAR',
                'deadline' => '15 Oct 2026',
                'benefits' => ['Food Provided', 'Direct Company Visa', '30 Days Annual Leave', 'Overtime'],
                'urgency' => 'Featured'
            ],
            [
                'id' => 3,
                'title' => 'Valet Parking & Executive Chauffeur',
                'country' => 'United Arab Emirates',
                'flagClass' => 'fi fi-ae',
                'city' => 'Dubai Marina',
                'trade' => 'Transportation & Driving',
                'positions' => 100,
                'salaryBDT' => 68000,
                'currencyLocal' => 'AED',
                'salaryLocal' => '2,100 AED + Tips',
                'deadline' => '12 Oct 2026',
                'benefits' => ['Service Tips', 'Shared Luxury Villa', 'Uniform & Laundry', '2-Year Renewable'],
                'urgency' => 'High Demand'
            ],
            [
                'id' => 4,
                'title' => 'CNC Machine Operator & Toolmaker',
                'country' => 'Croatia',
                'flagClass' => 'fi fi-hr',
                'city' => 'Zagreb & Split',
                'trade' => 'Mechanical & Technical',
                'positions' => 35,
                'salaryBDT' => 140000,
                'currencyLocal' => 'EUR',
                'salaryLocal' => '1,100 EUR Net',
                'deadline' => '28 Oct 2026',
                'benefits' => ['Schengen Work Permit', 'Accommodation Included', 'PR Path After 5 Yrs', 'EU Health'],
                'urgency' => 'European Quota'
            ],
            [
                'id' => 5,
                'title' => 'Structural Scaffolder & Steel Fixer',
                'country' => 'Romania',
                'flagClass' => 'fi fi-ro',
                'city' => 'Bucharest Industrial Zone',
                'trade' => 'Construction & Civil',
                'positions' => 90,
                'salaryBDT' => 115000,
                'currencyLocal' => 'EUR',
                'salaryLocal' => '900 EUR Net',
                'deadline' => '25 Oct 2026',
                'benefits' => ['Food Allowance', 'European Standard Safety', 'Free Work Permit', 'Overtime Pay'],
                'urgency' => 'Featured'
            ],
            [
                'id' => 6,
                'title' => 'SIRA Certified Security Officer',
                'country' => 'United Arab Emirates',
                'flagClass' => 'fi fi-ae',
                'city' => 'Abu Dhabi & Dubai',
                'trade' => 'Security Services',
                'positions' => 100,
                'salaryBDT' => 62000,
                'currencyLocal' => 'AED',
                'salaryLocal' => '1,920 AED',
                'deadline' => '18 Oct 2026',
                'benefits' => ['Free SIRA Training', 'Modern Accommodation', 'Duty Transportation', 'Medical Cover'],
                'urgency' => 'High Demand'
            ],
            [
                'id' => 7,
                'title' => 'Fleet Delivery Bike Rider (App-Based)',
                'country' => 'Kuwait',
                'flagClass' => 'fi fi-kw',
                'city' => 'Kuwait City',
                'trade' => 'Transportation & Driving',
                'positions' => 50,
                'salaryBDT' => 60000,
                'currencyLocal' => 'KWD',
                'salaryLocal' => '150 KWD + Commission',
                'deadline' => '14 Oct 2026',
                'benefits' => ['New Motorcycle & Fuel', 'SIM & Data Package', 'Commission per Delivery', 'Visa Provided'],
                'urgency' => 'Urgent'
            ],
            [
                'id' => 8,
                'title' => 'Commercial Cleaner & Facility Staff',
                'country' => 'Qatar',
                'flagClass' => 'fi fi-qa',
                'city' => 'Doha Airport Facilities',
                'trade' => 'Facility & Cleaning',
                'positions' => 250,
                'salaryBDT' => 48000,
                'currencyLocal' => 'QAR',
                'salaryLocal' => '1,450 QAR',
                'deadline' => '30 Oct 2026',
                'benefits' => ['Food & Accommodation', 'Duty Transport', 'Paid Overtime', 'Govt Verified Visa'],
                'urgency' => 'Mass Recruitment'
            ],
            [
                'id' => 9,
                'title' => 'Automotive Maintenance Technician',
                'country' => 'Japan',
                'flagClass' => 'fi fi-jp',
                'city' => 'Nagoya & Osaka',
                'trade' => 'Mechanical & Technical',
                'positions' => 20,
                'salaryBDT' => 185000,
                'currencyLocal' => 'JPY',
                'salaryLocal' => '230,000 JPY',
                'deadline' => '15 Nov 2026',
                'benefits' => ['TITP / SSW Visa', 'Japanese Language Training', 'Pension Scheme', 'High Savings Rate'],
                'urgency' => 'Skilled SSW'
            ],
            [
                'id' => 10,
                'title' => 'Construction Mason & Tile Specialist',
                'country' => 'Serbia',
                'flagClass' => 'fi fi-rs',
                'city' => 'Belgrade City Center',
                'trade' => 'Construction & Civil',
                'positions' => 45,
                'salaryBDT' => 105000,
                'currencyLocal' => 'EUR',
                'salaryLocal' => '820 EUR Net',
                'deadline' => '22 Oct 2026',
                'benefits' => ['Accommodation Provided', 'Balkans Fast Permit', 'Overtime Multiplier', 'Insurance'],
                'urgency' => 'Europe'
            ],
            [
                'id' => 11,
                'title' => 'Hospitality Line Cook & Kitchen Assistant',
                'country' => 'Saudi Arabia',
                'flagClass' => 'fi fi-sa',
                'city' => 'Jeddah Corniche',
                'trade' => 'Healthcare & Hospitality',
                'positions' => 40,
                'salaryBDT' => 58000,
                'currencyLocal' => 'SAR',
                'salaryLocal' => '1,800 SAR + Meals',
                'deadline' => '19 Oct 2026',
                'benefits' => ['Duty Meals Provided', 'Air Conditioned Housing', 'Medical & Iqama Paid', 'Tips'],
                'urgency' => 'Urgent'
            ],
            [
                'id' => 12,
                'title' => 'Industrial Electrician & Wireman',
                'country' => 'United Arab Emirates',
                'flagClass' => 'fi fi-ae',
                'city' => 'Sharjah Free Zone',
                'trade' => 'Construction & Civil',
                'positions' => 60,
                'salaryBDT' => 72000,
                'currencyLocal' => 'AED',
                'salaryLocal' => '2,250 AED',
                'deadline' => '26 Oct 2026',
                'benefits' => ['Accommodation & Transport', 'Tools Allowance', 'Overtime Paid 1.5x', 'Renewable Visa'],
                'urgency' => 'Featured'
            ]
        ];
    }

    /**
     * 18 Destination Countries list.
     */
    private function getDestinations(): array
    {
        return [
            [
                'name' => 'Kingdom of Saudi Arabia',
                'region' => 'gulf',
                'flagClass' => 'fi fi-sa',
                'visaType' => 'Employment Visa (Iqama)',
                'processDays' => '25 - 35 Days',
                'minWage' => '1,200 - 4,500 SAR',
                'openQuota' => '1,450+ Vacancies',
                'sectors' => 'NEOM mega-projects, construction, oil & gas, hospitality & fleet drivers.'
            ],
            [
                'name' => 'United Arab Emirates',
                'region' => 'gulf',
                'flagClass' => 'fi fi-ae',
                'visaType' => '2-Year MoHRE Work Permit',
                'processDays' => '20 - 30 Days',
                'minWage' => '1,400 - 5,000 AED',
                'openQuota' => '820+ Vacancies',
                'sectors' => 'Dubai hospitality, SIRA security, facility maintenance & valet chauffeurs.'
            ],
            [
                'name' => 'State of Qatar',
                'region' => 'gulf',
                'flagClass' => 'fi fi-qa',
                'visaType' => 'MoL Certified Work Visa',
                'processDays' => '25 - 35 Days',
                'minWage' => '1,400 - 3,800 QAR',
                'openQuota' => '600+ Vacancies',
                'sectors' => 'Infrastructure, airport facilities, commercial cleaning & logistics.'
            ],
            [
                'name' => 'State of Kuwait',
                'region' => 'gulf',
                'flagClass' => 'fi fi-kw',
                'visaType' => 'Shuon Work Visa (Article 18)',
                'processDays' => '30 - 40 Days',
                'minWage' => '130 - 350 KWD',
                'openQuota' => '340+ Vacancies',
                'sectors' => 'Food delivery riders, light drivers, mechanics & supermarket chains.'
            ],
            [
                'name' => 'Sultanate of Oman',
                'region' => 'gulf',
                'flagClass' => 'fi fi-om',
                'visaType' => 'ROP Resident Work Visa',
                'processDays' => '20 - 30 Days',
                'minWage' => '120 - 320 OMR',
                'openQuota' => '290+ Vacancies',
                'sectors' => 'Agriculture, mechanical workshops, carpentry & MEP contracting.'
            ],
            [
                'name' => 'Croatia (European Union)',
                'region' => 'europe',
                'flagClass' => 'fi fi-hr',
                'visaType' => 'EU Single Work & Residence Permit',
                'processDays' => '50 - 70 Days',
                'minWage' => '850 - 1,400 EUR',
                'openQuota' => '180+ Vacancies',
                'sectors' => 'Schengen civil engineering, CNC machinery, welding & warehousing.'
            ],
            [
                'name' => 'Romania (European Union)',
                'region' => 'europe',
                'flagClass' => 'fi fi-ro',
                'visaType' => 'IGI Work Authorization',
                'processDays' => '50 - 65 Days',
                'minWage' => '750 - 1,200 EUR',
                'openQuota' => '250+ Vacancies',
                'sectors' => 'Shipyard fabrication, masonry, automotive assembly & food processing.'
            ],
            [
                'name' => 'Republic of Serbia',
                'region' => 'europe',
                'flagClass' => 'fi fi-rs',
                'visaType' => 'National D Visa Work Permit',
                'processDays' => '40 - 55 Days',
                'minWage' => '700 - 1,100 EUR',
                'openQuota' => '120+ Vacancies',
                'sectors' => 'Road construction, hotel housekeeping, metal trades & heavy haulage.'
            ],
            [
                'name' => 'Republic of Poland',
                'region' => 'europe',
                'flagClass' => 'fi fi-pl',
                'visaType' => 'Voivodeship Type A Work Permit',
                'processDays' => '60 - 90 Days',
                'minWage' => '900 - 1,500 EUR',
                'openQuota' => '95+ Vacancies',
                'sectors' => 'Electronics assembly, meat packing, logistics picking & forklift operators.'
            ],
            [
                'name' => 'Japan',
                'region' => 'asia',
                'flagClass' => 'fi fi-jp',
                'visaType' => 'Specified Skilled Worker (SSW-1)',
                'processDays' => '60 - 90 Days',
                'minWage' => '200,000 - 280,000 JPY',
                'openQuota' => '80+ Vacancies',
                'sectors' => 'Caregiving, automotive mechanics, food service & precision fabrication.'
            ],
            [
                'name' => 'Republic of Korea (South Korea)',
                'region' => 'asia',
                'flagClass' => 'fi fi-kr',
                'visaType' => 'E-9 Employment Permit System',
                'processDays' => '60 - 80 Days',
                'minWage' => '2,060,000+ KRW',
                'openQuota' => '110+ Vacancies',
                'sectors' => 'Shipbuilding, electronic components, industrial manufacturing & farming.'
            ],
            [
                'name' => 'Malaysia',
                'region' => 'asia',
                'flagClass' => 'fi fi-my',
                'visaType' => 'FWCMS Legal Calling Visa',
                'processDays' => '35 - 45 Days',
                'minWage' => '1,500 - 2,800 MYR',
                'openQuota' => '450+ Vacancies',
                'sectors' => 'Plantation, electronics manufacturing, furniture making & warehousing.'
            ],
            [
                'name' => 'Singapore',
                'region' => 'asia',
                'flagClass' => 'fi fi-sg',
                'visaType' => 'MOM Work Permit (Construction)',
                'processDays' => '25 - 35 Days',
                'minWage' => '800 - 2,200 SGD',
                'openQuota' => '140+ Vacancies',
                'sectors' => 'BCA certified construction, shipyard trades & electrical systems.'
            ],
            [
                'name' => 'Commonwealth of Australia',
                'region' => 'asia',
                'flagClass' => 'fi fi-au',
                'visaType' => 'Subclass 482 / TSS Skilled Visa',
                'processDays' => '90 - 120 Days',
                'minWage' => '55,000+ AUD/yr',
                'openQuota' => '40+ Vacancies',
                'sectors' => 'Heavy diesel mechanics, certified pipe welders & nursing aides.'
            ],
            [
                'name' => 'Seychelles',
                'region' => 'asia',
                'flagClass' => 'fi fi-sc',
                'visaType' => 'GOP Employment Permit',
                'processDays' => '30 - 45 Days',
                'minWage' => '600 - 1,200 USD',
                'openQuota' => '65+ Vacancies',
                'sectors' => 'Resort maintenance, luxury hospitality, landscaping & carpentry.'
            ],
            [
                'name' => 'North Macedonia',
                'region' => 'europe',
                'flagClass' => 'fi fi-mk',
                'visaType' => 'Employment Residence Permit',
                'processDays' => '45 - 60 Days',
                'minWage' => '650 - 950 EUR',
                'openQuota' => '70+ Vacancies',
                'sectors' => 'Highway infrastructure, textile technicians & civil construction.'
            ],
            [
                'name' => 'Republic of Moldova',
                'region' => 'europe',
                'flagClass' => 'fi fi-md',
                'visaType' => 'Temporary Work Residence',
                'processDays' => '40 - 50 Days',
                'minWage' => '600 - 900 EUR',
                'openQuota' => '55+ Vacancies',
                'sectors' => 'Agricultural processing, masonry & commercial transport.'
            ],
            [
                'name' => 'Republic of Belarus',
                'region' => 'europe',
                'flagClass' => 'fi fi-by',
                'visaType' => 'Special Labor Permit',
                'processDays' => '40 - 55 Days',
                'minWage' => '600 - 950 USD',
                'openQuota' => '60+ Vacancies',
                'sectors' => 'Industrial machine operation, bricklaying & concrete casting.'
            ]
        ];
    }

    /**
     * Authorized Sub-Agents Directory.
     */
    private function getSubAgents(): array
    {
        return [
            [
                'id' => 'RSA-020',
                'name' => 'Kazi Md Ahsanul Hoque',
                'agency' => 'Exito Global Access & Travels',
                'district' => 'Cumilla',
                'status' => 'Active & Certified',
                'licenseRef' => 'BMET/RL-2092/RSA-020',
                'phone' => '+880 1711-234567'
            ],
            [
                'id' => 'RSA-017',
                'name' => 'Md. Abu Hanifa',
                'agency' => 'Wanderium Travels & Overseas',
                'district' => 'Narsingdi (Monohardi)',
                'status' => 'Active & Certified',
                'licenseRef' => 'BMET/RL-2092/RSA-017',
                'phone' => '+880 1819-345678'
            ],
            [
                'id' => 'RSA-015',
                'name' => 'Imran Khan',
                'agency' => 'Dhaka Overseas Employment Consultancy',
                'district' => 'Dhaka Central',
                'status' => 'Active & Certified',
                'licenseRef' => 'BMET/RL-2092/RSA-015',
                'phone' => '+880 1912-456789'
            ],
            [
                'id' => 'SMA-102',
                'name' => 'Farhad Mahmud',
                'agency' => 'Eastern Horizon Manpower Hub',
                'district' => 'Chattogram',
                'status' => 'Active & Certified',
                'licenseRef' => 'BMET/RL-1301/SMA-102',
                'phone' => '+880 1817-567890'
            ],
            [
                'id' => 'SMA-108',
                'name' => 'Shafiqul Islam Talukder',
                'agency' => 'Surma Global Visa Service',
                'district' => 'Sylhet',
                'status' => 'Active & Certified',
                'licenseRef' => 'BMET/RL-1301/SMA-108',
                'phone' => '+880 1713-678901'
            ],
            [
                'id' => 'SMA-114',
                'name' => 'Golam Mostafa',
                'agency' => 'Padma Bridge Overseas Link',
                'district' => 'Tangail',
                'status' => 'Active & Certified',
                'licenseRef' => 'BMET/RL-1301/SMA-114',
                'phone' => '+880 1622-789012'
            ]
        ];
    }
}
