from agents.privacy_agent import PrivacyAgent
from agents.vision_agent import VisionAgent
from agents.seo_agent import SEOAgent
from agents.marketing_agent import MarketingAgent
from agents.competitor_agent import CompetitorAgent
from agents.quality_agent import QualityAgent
from agents.rag_agent import RAGAgent
from scoring.scoring_engine import ScoringEngine

class Orchestrator:
    def __init__(self):
        # Initialize agents
        self.privacy_agent = PrivacyAgent()
        self.vision_agent = VisionAgent()
        self.seo_agent = SEOAgent()
        self.marketing_agent = MarketingAgent()
        self.competitor_agent = CompetitorAgent()
        self.quality_agent = QualityAgent()
        self.rag_agent = RAGAgent()
        self.scoring_engine = ScoringEngine()
        
    def process_request(self, raw_input: str, images: list = None, platform: str = "olx"):
        results = {}
        
        # Step 1: PII Detection & Anonymization
        sanitized_input = self.privacy_agent.sanitize(raw_input)
        results["sanitized_input"] = sanitized_input
        
        # Step 2: Vision Analysis (supports multiple images)
        if images:
            vision_result = self.vision_agent.analyze_image(images)
            results["vision_analysis"] = vision_result
            
        # Combine text and vision for downstream agents
        combined_context = f"Text Description:\n{sanitized_input}"
        if images and "vision_analysis" in results:
            combined_context += f"\n\nVision Analysis:\n{results['vision_analysis']}"

        # Step 2.5: RAG Retrieval
        rag_context = self.rag_agent.retrieve_similar_products(combined_context)
        results["rag_context"] = rag_context
        
        # Append RAG to combined context so agents have market data
        combined_context += f"\n\n{rag_context}"

        # Step 3: SEO Optimization (Now with vision & market context)
        seo_result = self.seo_agent.optimize(combined_context)
        results["seo"] = seo_result

        # Step 4: Marketing Content Generation
        seo_title = seo_result.get("title", "") if isinstance(seo_result, dict) else ""
        marketing_result = self.marketing_agent.generate(combined_context, seo_title=seo_title, platform=platform)
        results["marketing"] = marketing_result

        # Step 5: Competitor Intel
        competitor_result = self.competitor_agent.analyze(sanitized_input)
        results["competitor_analysis"] = competitor_result

        # Step 6: Validation & Quality Scoring
        validation_result = self.quality_agent.validate(seo_result, marketing_result)
        results["validation"] = validation_result

        # Step 7: Scoring
        scores = self.scoring_engine.evaluate(seo_result, marketing_result, sanitized_input)
        results["scores"] = scores

        return {
            "status": "success",
            "message": "Workflow completed",
            "data": results
        }

