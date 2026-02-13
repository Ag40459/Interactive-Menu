import { useEffect, useCallback } from 'react';
import styles from './ContactModal.module.css';
import { useForm, Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { formatCNPJ, formatPhone, onlyNumbers } from '../../utils/formatters';
import { fetchCNPJData } from '../../utils/cnpjService';
import { fetchCepData } from '../../utils/cepService';
import { modelosImovelPJ, pretensaoPagamentoOptions } from '../../config/formConfig';

const setIfEmpty = (currentValue, newValue, setFunction) => {
  if (newValue !== undefined && newValue !== null && newValue !== '' && !currentValue) {
    setFunction(newValue);
  }
};

const PessoaJuridicaForm = ({ onFormSubmitReady, onFormSubmitData, loadingCep, cepError, setLoadingCep, setCepError }) => {
  const {
    control,
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      pjCnpj: '',
      pjNomeEmpresa: '',
      pjNomeResponsavel: '',
      pjTelefone: '',
      pjEmailComercial: '',
      pjModeloImovel: '',
      pjOutroModeloImovel: '',
      pjMediaContaEnergia: null,
      pjCep: '',
      pjPretensaoPagamento: '',
      pjRua: '',
      pjNumero: '0002',
      pjComplemento: '',
      pjBairro: '',
      pjCidade: '',
      pjEstado: '',
      pjTelefoneResponsavel: ''
    }
  });

  const watchedValues = watch();

   const handleFormSubmit = useCallback((data) => {
      onFormSubmitData(data);
    }, [onFormSubmitData]);
  
   useEffect(() => {
      const wrapped = handleSubmit(handleFormSubmit);
      onFormSubmitReady(wrapped);
    }, [handleFormSubmit, handleSubmit, onFormSubmitReady]);

  // Effect to fetch CNPJ data and update RHF state if fields are empty
  useEffect(() => {
    const fetchData = async () => {
      const cleanCnpj = watchedValues.pjCnpj?.replace(/\D/g, '');
      if (cleanCnpj?.length === 14) {
        const data = await fetchCNPJData(cleanCnpj);
        if (data) {
          setIfEmpty(watchedValues.pjNomeEmpresa, data.razao_social, (val) => setValue('pjNomeEmpresa', val));
          setIfEmpty(watchedValues.pjEmailComercial, data.email, (val) => setValue('pjEmailComercial', val));
          setIfEmpty(watchedValues.pjTelefone, formatPhone(`${data.ddd}${data.telefone}`), (val) => {
             setValue('pjTelefone', val);
             if (!watchedValues.pjTelefoneResponsavel || watchedValues.pjTelefoneResponsavel === watchedValues.pjTelefone) {
                setValue('pjTelefoneResponsavel', val);
             }
          });
          setIfEmpty(watchedValues.pjRua, data.logradouro, (val) => setValue('pjRua', val));
          setIfEmpty(watchedValues.pjComplemento, data.complemento, (val) => setValue('pjComplemento', val));
          setIfEmpty(watchedValues.pjBairro, data.bairro, (val) => setValue('pjBairro', val));
          setIfEmpty(watchedValues.pjCidade, data.municipio, (val) => setValue('pjCidade', val));
          setIfEmpty(watchedValues.pjEstado, data.uf, (val) => setValue('pjEstado', val));
          const fetchedCep = data.cep?.replace(/\D/g, '');
          setIfEmpty(watchedValues.pjCep, fetchedCep, (val) => setValue('pjCep', val));
        }
      }
    };
    if (watchedValues.pjCnpj?.replace(/\D/g, '').length === 14) {
        fetchData();
    }
  }, [watchedValues.pjCnpj, setValue]);

  // Effect to fetch CEP data
  const watchedCep = watch('pjCep');
  useEffect(() => {
    if (watchedCep && watchedCep.replace(/[^0-9]/g, '').length === 8) {
      const numericCep = watchedCep.replace(/[^0-9]/g, '');
      setLoadingCep(true);
      setCepError('');
      fetchCepData(numericCep)
        .then(data => {
          setLoadingCep(false);
          if (data.erro) {
            setCepError('CEP não encontrado.');
            setValue('pjRua', '');
            setValue('pjNumero', '0002');
            setValue('pjComplemento', '');
            setValue('pjBairro', '');
            setValue('pjCidade', '');
            setValue('pjEstado', '');
            return;
          }
          setValue('pjRua', data.logradouro || '');
          setValue('pjBairro', data.bairro || '');
          setValue('pjCidade', data.localidade || '');
          setValue('pjEstado', data.uf || '');
        })
        .catch(err => {
          setLoadingCep(false);
          setCepError(err.message || 'Erro ao buscar CEP. Tente novamente.');
          setValue('pjRua', '');
          setValue('pjNumero', '0002');
          setValue('pjComplemento', '');
          setValue('pjBairro', '');
          setValue('pjCidade', '');
          setValue('pjEstado', '');
        });
    }
  }, [watchedCep, setValue, setLoadingCep, setCepError]);

  const isNomeEmpresaFromApi = watchedValues.pjCnpj?.replace(/\D/g, '').length === 14 && watchedValues.pjNomeEmpresa;

  return (
    <>
      <div className={styles.formGroup}>
        <input
          id="pjCnpj"
          type="text"
          className={styles.formInput}
          maxLength={18}
          placeholder="CNPJ - 00.000.000/0000-00"
          {...register('pjCnpj', {
            required: 'CNPJ é obrigatório',
            pattern: { value: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, message: 'CNPJ inválido' },
            onChange: (e) => {
              const formatted = formatCNPJ(e.target.value);
              setValue('pjCnpj', formatted, { shouldValidate: true });
            }
          })}
        />
        {errors.pjCnpj && <p className={styles.errorMessage}>{errors.pjCnpj.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <input
          id="pjNomeEmpresa"
          type="text"
          className={styles.formInput}
          placeholder="Razão Social"
          readOnly={isNomeEmpresaFromApi}
          {...register('pjNomeEmpresa', { required: 'Razão Social é obrigatória' })}
        />
        {errors.pjNomeEmpresa && <p className={styles.errorMessage}>{errors.pjNomeEmpresa.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <input
          id="pjNomeResponsavel"
          type="text"
          className={styles.formInput}
          placeholder="Nome"
          {...register('pjNomeResponsavel', { required: 'Nome do Responsável é obrigatório' })}
        />
        {errors.pjNomeResponsavel && <p className={styles.errorMessage}>{errors.pjNomeResponsavel.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <input
          id="pjTelefone"
          type="tel"
          className={styles.formInput}
          maxLength={15}
          placeholder="Telefone - (00) 00000-0000"
          {...register('pjTelefone', {
            required: 'Telefone é obrigatório',
            pattern: { value: /^\(\d{2}\)\s?\d{4,5}-\d{4}$/, message: 'Telefone inválido' },
            onChange: (e) => {
              const formatted = formatPhone(e.target.value);
              setValue('pjTelefone', formatted, { shouldValidate: true });
              if (!watchedValues.pjTelefoneResponsavel || watchedValues.pjTelefoneResponsavel === watchedValues.pjTelefone) {
                 setValue('pjTelefoneResponsavel', formatted);
              }
            }
          })}
        />
        {errors.pjTelefone && <p className={styles.errorMessage}>{errors.pjTelefone.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <input
          id="pjEmailComercial"
          type="email"
          className={styles.formInput}
          placeholder="email@empresa.com"
          {...register('pjEmailComercial', {
            required: 'Email Comercial é obrigatório',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Email inválido' }
          })}
        />
        {errors.pjEmailComercial && <p className={styles.errorMessage}>{errors.pjEmailComercial.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <select
          id="pjModeloImovel"
          className={styles.formInput}
          {...register('pjModeloImovel', { required: 'Selecione o tipo do imóvel' })}
        >
          {modelosImovelPJ.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.pjModeloImovel && <p className={styles.errorMessage}>{errors.pjModeloImovel.message}</p>}
      </div>

      {watch('pjModeloImovel') === 'Outro' && (
        <div className={styles.formGroup}>
          <label htmlFor="pjOutroModeloImovel">Outro tipo de imóvel:</label>
          <input
            id="pjOutroModeloImovel"
            type="text"
            className={styles.formInput}
            {...register('pjOutroModeloImovel', {
              required: watch('pjModeloImovel') === 'Outro' ? 'Especifique o tipo' : false
            })}
          />
          {errors.pjOutroModeloImovel && <p className={styles.errorMessage}>{errors.pjOutroModeloImovel.message}</p>}
        </div>
      )}

      <div className={styles.formGroup}>
        <Controller
          name="pjMediaContaEnergia"
          control={control}
          rules={{
            required: 'Valor é obrigatório',
            min: { value: 0.01, message: 'Valor deve ser maior que zero' }
          }}
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <NumericFormat
              id="pjMediaContaEnergia"
              name={name}
              getInputRef={ref}
              className={styles.formInput}
              value={value}
              onValueChange={(values) => {
                onChange(values.floatValue === undefined ? null : values.floatValue);
              }}
              onBlur={onBlur}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale={true}
              allowNegative={false}
              placeholder="Valor da Sua Conta de Energia - R$ 0,00"
              inputMode="decimal"
              required
            />
          )}
        />
        {errors.pjMediaContaEnergia && <p className={styles.errorMessage}>{errors.pjMediaContaEnergia.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <input
          id="pjCep"
          type="tel"
          className={styles.formInput}
          maxLength={8}
          placeholder="CEP"
          {...register('pjCep', {
            required: 'CEP é obrigatório',
            pattern: { value: /^\d{8}$/, message: 'CEP inválido (somente números)' },
            onChange: (e) => {
              const formatted = onlyNumbers(e.target.value);
              setValue('pjCep', formatted, { shouldValidate: true });
            }
          })}
        />
        {loadingCep && <p className={styles.loadingMessage}>Buscando CEP...</p>}
        {cepError && <p className={styles.errorMessage}>{cepError}</p>}
        {errors.pjCep && <p className={styles.errorMessage}>{errors.pjCep.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <select
          id="pjPretensaoPagamento"
          className={styles.formInput}
          {...register('pjPretensaoPagamento', { required: 'Selecione a pretensão' })}
        >
          {pretensaoPagamentoOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.pjPretensaoPagamento && <p className={styles.errorMessage}>{errors.pjPretensaoPagamento.message}</p>}
      </div>

      <input type="hidden" {...register('pjRua')} />
      <input type="hidden" {...register('pjNumero')} />
      <input type="hidden" {...register('pjComplemento')} />
      <input type="hidden" {...register('pjBairro')} />
      <input type="hidden" {...register('pjCidade')} />
      <input type="hidden" {...register('pjEstado')} />
      <input type="hidden" {...register('pjTelefoneResponsavel')} />
    </>
  );
};

export default PessoaJuridicaForm;


