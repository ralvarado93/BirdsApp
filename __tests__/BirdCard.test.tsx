import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import BirdCard from '../src/components/BirdCard';
import { Bird } from '../src/types/Bird';

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
}));

const mockNavigate = jest.fn();


const bird: Bird = {
    name: {
        spanish: 'Águila', english: 'Eagle',
        latin: ''
    },
    images: {
        thumb: 'https://example.com/eagle.jpg',
        main: '',
        full: '',
        gallery: []
    },
    _links: {
      parent: 'https://aves.ninjas.cl/api/birds',
      self: 'https://aves.ninjas.cl/api/birds/76-buteo-albigula',
    },
    sort: 0,
    uid: '76-buteo-albigula',
  };

describe('BirdCard', () => {
    beforeEach(() => {
        (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    });

    it('renders bird details correctly', () => {
        const { getByText, getByTestId } = render(<BirdCard bird={bird} />);

        expect(getByText('Águila')).toBeTruthy();
        expect(getByText('Eagle')).toBeTruthy();

        const image = getByTestId('bird-image');
        expect(image.props.source.uri).toBe(bird.images.thumb);
    });

    it('navigates to the detail screen when card is pressed', () => {
        const { getByTestId } = render(<BirdCard bird={bird} />);

        const card = getByTestId('bird-card');
        fireEvent.press(card);
        expect(mockNavigate).toHaveBeenCalledWith('Detail', { bird });
    });
});
