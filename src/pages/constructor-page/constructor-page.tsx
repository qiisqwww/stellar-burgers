import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.ingredients.loading);
  const error = useSelector((state) => state.ingredients.error);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  if (error) {
    return <p className='text text_type_main-default'>{error}</p>;
  }

  // return loading ? (
  //   <Preloader />
  // ) : (
  //   <main className={styles.containerMain}>
  //     <h1
  //       className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
  //     >
  //       Соберите бургер
  //     </h1>
  //     <div className={`${styles.main} pl-5 pr-5`}>
  //       <BurgerIngredients />
  //       <BurgerConstructor />
  //     </div>
  //   </main>
  // );

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
