import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.ingredients
  );

  useEffect(() => {
    // Если ингредиенты не загружены, запросить их
    if (!items.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, items.length]);

  // Пока идёт загрузка или нет данных — показать прелоадер
  if (loading || !items.length) {
    return <Preloader />;
  }

  if (error) {
    return <p className='text text_type_main-default'>Ошибка: {error}</p>;
  }

  const ingredientData = items.find((item) => item._id === id!);

  if (!ingredientData) {
    return <p className='text text_type_main-default'>Ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
