import PropTypes from "prop-types";
import { Card, CardMedia, CardContent, Typography, CardActions} from '@mui/material';
import { Link } from "react-router-dom";

const CustomCard = ({ image, title, description, link, linkText }) => (
    <Card sx={{ maxWidth: 250 }} className="mx-4">
        <CardMedia sx={{ height: 255 }} image={image} title={title} />
        <CardContent>
            <Typography variant="h6" color="text.primary" className="text-gray-500 text-xl font-bold">
                {description}
            </Typography>
        </CardContent>
        <CardActions className="flex justify-center">
            <Link className=" text-blue-500 hover:text-blue-700" to={link}>
                {linkText}
            </Link>
        </CardActions>
    </Card>
);

CustomCard.propTypes = {
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
};


export default CustomCard;