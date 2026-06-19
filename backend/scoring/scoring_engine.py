import re

class ScoringEngine:
    def __init__(self):
        pass

    def evaluate(self, seo_result: dict, marketing_result: dict, privacy_result: str) -> dict:
        scores = {}
        
        # 1. Privacy Safety Score (always 100 if presidio ran successfully, but we can do a mock heuristic)
        # If there are placeholders like <PHONE_NUMBER> it means it worked.
        privacy_score = 100 if "<" in privacy_result and ">" in privacy_result else 90
        scores["privacy_score"] = privacy_score
        
        # 2. SEO Score
        seo_score = 0
        if isinstance(seo_result, dict):
            if seo_result.get("title"):
                seo_score += 40
            if seo_result.get("keywords") and len(seo_result.get("keywords")) > 2:
                seo_score += 30
            if seo_result.get("bullet_points") and len(seo_result.get("bullet_points")) >= 3:
                seo_score += 30
        scores["seo_score"] = seo_score

        # 3. Content Quality Score
        quality_score = 0
        if isinstance(marketing_result, dict):
            desc = marketing_result.get("platform_description", "")
            if len(desc) > 50:
                quality_score += 50
            if marketing_result.get("call_to_action"):
                quality_score += 50
        scores["content_quality_score"] = quality_score
        
        # 4. Overall Readability Score (mock heuristic based on sentence length)
        # Assuming avg characters per sentence
        desc = marketing_result.get("platform_description", "") if isinstance(marketing_result, dict) else ""
        sentences = re.split(r'[.!?]+', desc)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 0]
        if sentences:
            avg_len = sum(len(s) for s in sentences) / len(sentences)
            if 40 <= avg_len <= 100:
                readability = 100
            elif avg_len < 40:
                readability = 85
            else:
                readability = 70
        else:
            readability = 0
            
        scores["readability_score"] = readability
        
        # Aggregate
        scores["overall_score"] = int((privacy_score + seo_score + quality_score + readability) / 4)

        return scores
