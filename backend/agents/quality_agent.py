class QualityAgent:
    def __init__(self):
        pass

    def validate(self, seo_result: dict, marketing_result: dict) -> dict:
        issues = []
        if isinstance(seo_result, dict):
            if not seo_result.get("title"):
                issues.append("SEO Title is missing.")
            if not seo_result.get("keywords") or len(seo_result.get("keywords", [])) == 0:
                issues.append("SEO Keywords are missing.")
        else:
            issues.append("SEO output is malformed.")

        if isinstance(marketing_result, dict):
            if not marketing_result.get("platform_description"):
                issues.append("Platform description is missing.")
        else:
            issues.append("Marketing output is malformed.")

        return {
            "is_valid": len(issues) == 0,
            "issues": issues
        }
