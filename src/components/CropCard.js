import React from 'react';
import { Card, ListGroup, Badge, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSeedling, faCalendarDays, faScaleBalanced, 
  faCoins, faLeaf, faClipboardList, faEdit, faTrash 
} from '@fortawesome/free-solid-svg-icons';

const CropCard = ({ crop, onEdit, onDelete, onViewStages, onViewOrders }) => (
  <Card className="h-100 shadow-sm crop-card">
    <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
      <div>
        <FontAwesomeIcon icon={faSeedling} className="me-2" />
        <strong>{crop.name}</strong>
      </div>
      <Badge bg="light" text="dark" className="text-capitalize">
        {crop.status}
      </Badge>
    </Card.Header>
    
    <Card.Body>
      <ListGroup variant="flush" className="small">
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
          <div>
            <FontAwesomeIcon icon={faCalendarDays} className="me-2 text-muted" />
            Duration
          </div>
          <span className="fw-bold">{crop.duration_days} days</span>
        </ListGroup.Item>

        <ListGroup.Item className="d-flex justify-content-between align-items-center">
          <div>
            <FontAwesomeIcon icon={faScaleBalanced} className="me-2 text-muted" />
            Yield
          </div>
          <span className="fw-bold">{crop.estimated_yield} kg</span>
        </ListGroup.Item>

        <ListGroup.Item className="d-flex justify-content-between align-items-center">
          <div>
            <FontAwesomeIcon icon={faCoins} className="me-2 text-muted" />
            Price
          </div>
          <span className="fw-bold">₹{crop.estimated_price}</span>
        </ListGroup.Item>
      </ListGroup>
    </Card.Body>

    <Card.Footer className="bg-light border-top-0">
      <div className="d-flex flex-wrap gap-2 justify-content-between">
        <Button 
          variant="outline-primary" 
          size="sm"
          onClick={() => onViewStages(crop.id)}
        >
          <FontAwesomeIcon icon={faLeaf} />
          <span>Stages</span>
        </Button>
        
        <Button 
          variant="outline-success" 
          size="sm"
          onClick={() => onViewOrders(crop.id)}
        >
          <FontAwesomeIcon icon={faClipboardList} />
          <span>Orders</span>
        </Button>
        
        <Button 
          variant="outline-warning" 
          size="sm"
          onClick={() => onEdit(crop.id)}
        >
          <FontAwesomeIcon icon={faEdit} />
          <span>Edit</span>
        </Button>
        
        <Button 
          variant="outline-danger" 
          size="sm"
          onClick={() => onDelete(crop)}
        >
          <FontAwesomeIcon icon={faTrash} />
          <span className="ms-2 d-none d-md-inline">Delete</span>
        </Button>
      </div>
    </Card.Footer>
  </Card>
);

export default CropCard;