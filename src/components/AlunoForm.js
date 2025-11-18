import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './AlunoForm.css';
import api from '../services/api';
import PasswordStrength from './PasswordStrength';

const AlunoForm = () => {
  const [formData, setFormData] = useState({
    nome_completo: '',
    usuario_acesso: '',
    senha: '',
    confirmar_senha: '',
    email_aluno: '',
    observacao: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(null);

  // Verificar se as senhas coincidem em tempo real
  useEffect(() => {
    if (formData.confirmar_senha) {
      if (formData.senha === formData.confirmar_senha) {
        setPasswordsMatch(true);
        if (errors.confirmar_senha && errors.confirmar_senha === 'As senhas não coincidem') {
          setErrors(prev => ({ ...prev, confirmar_senha: '' }));
        }
      } else {
        setPasswordsMatch(false);
      }
    } else {
      setPasswordsMatch(null);
    }
  }, [formData.senha, formData.confirmar_senha, errors.confirmar_senha]);

  // Validação no lado do cliente
  const validate = () => {
    const newErrors = {};

    // Nome completo
    if (!formData.nome_completo.trim()) {
      newErrors.nome_completo = 'Nome completo é obrigatório';
    } else if (formData.nome_completo.trim().length < 3) {
      newErrors.nome_completo = 'Nome completo deve ter pelo menos 3 caracteres';
    } else if (formData.nome_completo.trim().length > 255) {
      newErrors.nome_completo = 'Nome completo deve ter no máximo 255 caracteres';
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.nome_completo.trim())) {
      newErrors.nome_completo = 'Nome completo deve conter apenas letras e espaços';
    }

    // Usuário de acesso
    if (!formData.usuario_acesso.trim()) {
      newErrors.usuario_acesso = 'Usuário de acesso é obrigatório';
    } else if (formData.usuario_acesso.trim().length < 3) {
      newErrors.usuario_acesso = 'Usuário de acesso deve ter pelo menos 3 caracteres';
    } else if (formData.usuario_acesso.trim().length > 50) {
      newErrors.usuario_acesso = 'Usuário de acesso deve ter no máximo 50 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.usuario_acesso.trim())) {
      newErrors.usuario_acesso = 'Usuário deve conter apenas letras, números e underscore';
    }

    // Senha
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    } else if (formData.senha.length > 100) {
      newErrors.senha = 'Senha deve ter no máximo 100 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.senha)) {
      newErrors.senha = 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número';
    }

    // Confirmar senha
    if (!formData.confirmar_senha) {
      newErrors.confirmar_senha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmar_senha) {
      newErrors.confirmar_senha = 'As senhas não coincidem';
    }

    // E-mail
    if (!formData.email_aluno.trim()) {
      newErrors.email_aluno = 'E-mail é obrigatório';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email_aluno.trim())) {
        newErrors.email_aluno = 'E-mail deve ter um formato válido';
      } else if (formData.email_aluno.trim().length > 255) {
        newErrors.email_aluno = 'E-mail deve ter no máximo 255 caracteres';
      }
    }

    // Observação (opcional)
    if (formData.observacao && formData.observacao.length > 1000) {
      newErrors.observacao = 'Observação deve ter no máximo 1000 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manipular mudanças nos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Por favor, corrija os erros no formulário', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/alunos', {
        nome_completo: formData.nome_completo.trim(),
        usuario_acesso: formData.usuario_acesso.trim(),
        senha: formData.senha,
        email_aluno: formData.email_aluno.trim().toLowerCase(),
        observacao: formData.observacao.trim() || null
      });

      toast.success(response.data.message || 'Aluno cadastrado com sucesso!', {
        position: "top-right",
        autoClose: 5000,
      });

      // Limpar formulário
      setFormData({
        nome_completo: '',
        usuario_acesso: '',
        senha: '',
        confirmar_senha: '',
        email_aluno: '',
        observacao: ''
      });
      setPasswordsMatch(null);
      setErrors({});

    } catch (error) {
      if (error.response) {
        // Erro do servidor
        const serverError = error.response.data;
        if (serverError.errors && Array.isArray(serverError.errors)) {
          // Erros de validação do servidor
          const serverErrors = {};
          serverError.errors.forEach(err => {
            serverErrors[err.path || err.param] = err.msg || err.message;
          });
          setErrors(prev => ({ ...prev, ...serverErrors }));
          toast.error(serverError.message || 'Erro ao cadastrar aluno', {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          toast.error(serverError.message || 'Erro ao cadastrar aluno', {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } else if (error.request) {
        toast.error('Erro de conexão. Verifique se o servidor está rodando.', {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        toast.error('Erro inesperado. Tente novamente.', {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aluno-form-container">
      <form className="aluno-form" onSubmit={handleSubmit}>
        <h2>Cadastrar Novo Aluno</h2>
        <p className="form-subtitle">Preencha os dados abaixo para cadastrar um novo aluno</p>

        {/* Nome Completo */}
        <div className="form-group">
          <label htmlFor="nome_completo">
            Nome Completo <span className="required">*</span>
          </label>
          <input
            type="text"
            id="nome_completo"
            name="nome_completo"
            value={formData.nome_completo}
            onChange={handleChange}
            className={errors.nome_completo ? 'error' : ''}
            placeholder="Digite o nome completo"
            disabled={loading}
          />
          {errors.nome_completo && (
            <span className="error-message">{errors.nome_completo}</span>
          )}
        </div>

        {/* Usuário de Acesso */}
        <div className="form-group">
          <label htmlFor="usuario_acesso">
            Usuário de Acesso <span className="required">*</span>
          </label>
          <input
            type="text"
            id="usuario_acesso"
            name="usuario_acesso"
            value={formData.usuario_acesso}
            onChange={handleChange}
            className={errors.usuario_acesso ? 'error' : ''}
            placeholder="Digite o usuário de acesso"
            disabled={loading}
          />
          {errors.usuario_acesso && (
            <span className="error-message">{errors.usuario_acesso}</span>
          )}
          <small className="hint">Apenas letras, números e underscore</small>
        </div>

        {/* Senha */}
        <div className="form-group">
          <label htmlFor="senha">
            Senha <span className="required">*</span>
          </label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className={errors.senha ? 'error' : ''}
              placeholder="Digite a senha"
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.senha && (
            <span className="error-message">{errors.senha}</span>
          )}
          <PasswordStrength password={formData.senha} />
        </div>

        {/* Confirmar Senha */}
        <div className="form-group">
          <label htmlFor="confirmar_senha">
            Confirmar Senha <span className="required">*</span>
          </label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmar_senha"
              name="confirmar_senha"
              value={formData.confirmar_senha}
              onChange={handleChange}
              className={
                errors.confirmar_senha 
                  ? 'error' 
                  : passwordsMatch === false 
                    ? 'error' 
                    : passwordsMatch === true 
                      ? 'success' 
                      : ''
              }
              placeholder="Confirme a senha"
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
              aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.confirmar_senha && (
            <span className="error-message">{errors.confirmar_senha}</span>
          )}
          {formData.confirmar_senha && passwordsMatch === false && (
            <span className="error-message">⚠️ As senhas não coincidem</span>
          )}
          {formData.confirmar_senha && passwordsMatch === true && (
            <span className="success-message">✓ As senhas coincidem</span>
          )}
        </div>

        {/* E-mail */}
        <div className="form-group">
          <label htmlFor="email_aluno">
            E-mail <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email_aluno"
            name="email_aluno"
            value={formData.email_aluno}
            onChange={handleChange}
            className={errors.email_aluno ? 'error' : ''}
            placeholder="exemplo@email.com"
            disabled={loading}
          />
          {errors.email_aluno && (
            <span className="error-message">{errors.email_aluno}</span>
          )}
        </div>

        {/* Observação */}
        <div className="form-group">
          <label htmlFor="observacao">Observação</label>
          <textarea
            id="observacao"
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
            className={errors.observacao ? 'error' : ''}
            placeholder="Observações adicionais (opcional)"
            rows="4"
            disabled={loading}
          />
          {errors.observacao && (
            <span className="error-message">{errors.observacao}</span>
          )}
          <small className="hint">
            {formData.observacao.length}/1000 caracteres
          </small>
        </div>

        {/* Botão de Submit */}
        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Cadastrando...
            </>
          ) : (
            'Cadastrar Aluno'
          )}
        </button>
      </form>
    </div>
  );
};

export default AlunoForm;
