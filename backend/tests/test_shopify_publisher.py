import pytest
from unittest.mock import patch, MagicMock
from publishers.shopify_publisher import ShopifyPublisher

@pytest.fixture
def publisher():
    return ShopifyPublisher("test-store.myshopify.com", "shpat_test_token")

@patch('publishers.shopify_publisher.httpx.get')
def test_test_connection_success(mock_get, publisher):
    # Simulate a successful connection
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_get.return_value = mock_response
    
    assert publisher.test_connection() is True

@patch('publishers.shopify_publisher.httpx.get')
def test_test_connection_failure(mock_get, publisher):
    # Simulate a failed connection
    mock_response = MagicMock()
    mock_response.status_code = 401
    mock_get.return_value = mock_response
    
    assert publisher.test_connection() is False

@patch('publishers.shopify_publisher.httpx.post')
def test_publish_product_success(mock_post, publisher):
    # Simulate a successful product creation
    mock_response = MagicMock()
    mock_response.status_code = 201
    mock_response.json.return_value = {
        "product": {
            "id": 123456789,
            "title": "Test Product",
            "status": "draft",
            "handle": "test-product"
        }
    }
    mock_post.return_value = mock_response
    
    result = publisher.publish_product(
        title="Test Product",
        body_html="<p>Test description</p>",
        tags=["test"],
        price="19.99"
    )
    
    assert result["shopify_product_id"] == 123456789
    assert result["title"] == "Test Product"
    assert result["status"] == "draft"
    assert "123456789" in result["admin_url"]

@patch('publishers.shopify_publisher.httpx.post')
def test_publish_product_failure(mock_post, publisher):
    # Simulate an API error
    mock_response = MagicMock()
    mock_response.status_code = 422
    mock_response.text = '{"errors": {"title": ["can\'t be blank"]}}'
    mock_post.return_value = mock_response
    
    with pytest.raises(RuntimeError) as exc_info:
        publisher.publish_product(
            title="",
            body_html="<p>Test description</p>"
        )
    
    assert "Shopify API error [422]" in str(exc_info.value)
