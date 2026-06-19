from presidio_analyzer import AnalyzerEngine, PatternRecognizer, Pattern
from presidio_anonymizer import AnonymizerEngine

class PrivacyAgent:
    def __init__(self):
        self.analyzer = AnalyzerEngine()
        
        # Add a custom regex recognizer for loose phone numbers (8-15 digits, optional +, -, spaces, or parentheses)
        phone_pattern = Pattern(
            name="loose_phone",
            regex=r"\b\+?\d[\d\s\-\(\)]{6,13}\d\b",
            score=0.5
        )
        custom_phone_recognizer = PatternRecognizer(
            supported_entity="PHONE_NUMBER", 
            patterns=[phone_pattern],
            context=["phone", "contact", "call", "whatsapp", "number"]
        )
        self.analyzer.registry.add_recognizer(custom_phone_recognizer)
        
        self.anonymizer = AnonymizerEngine()
        
    def sanitize(self, text: str) -> str:
        # Analyze the text for PII
        results = self.analyzer.analyze(text=text, entities=["PHONE_NUMBER", "EMAIL_ADDRESS", "PERSON", "LOCATION"], language='en')
        
        # Anonymize the findings
        anonymized_result = self.anonymizer.anonymize(text=text, analyzer_results=results)
        
        return anonymized_result.text
