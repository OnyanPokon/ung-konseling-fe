/* eslint-disable react/prop-types */
import { Tag, Typography, Divider } from 'antd';
import { HeartOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const statusColor = {
  pending: 'orange',
  approved: 'blue',
  rejected: 'red'
};

const statusTheme = {
  pending: {
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    border: '#fde68a',
    badge: 'orange',
    softBg: '#fffbeb',
    softBorder: '#fde68a',
    accentText: '#b45309'
  },
  approved: {
    gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    border: '#bfdbfe',
    badge: 'blue',
    softBg: '#eff6ff',
    softBorder: '#bfdbfe',
    accentText: '#1d4ed8'
  },
  rejected: {
    gradient: 'linear-gradient(135deg, #dc2626, #ef4444)',
    border: '#fecaca',
    badge: 'red',
    softBg: '#fef2f2',
    softBorder: '#fecaca',
    accentText: '#b91c1c'
  },
  default: {
    gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)',
    border: '#e5e7eb',
    badge: 'default',
    softBg: '#f9fafb',
    softBorder: '#e5e7eb',
    accentText: '#374151'
  }
};

export default function CounselingTicket({ type, ticket_number, day_name, status, created_at, desc, service_type }) {
  const theme = statusTheme[status?.toLowerCase()] || statusTheme.default;

  return (
    <div
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 16,
        transition: 'all 0.3s ease'
      }}
    >
      <div
        style={{
          background: theme.gradient,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: 2 }} className="uppercase">
            TIKET LAYANAN {service_type}{' '}
          </Text>
          <Title level={5} style={{ color: '#fff', margin: '4px 0 0', fontStyle: 'italic' }}>
            {type}
          </Title>
        </div>
        <HeartOutlined style={{ color: 'rgba(255,255,255,0.3)', fontSize: 36 }} />
      </div>

      <div
        style={{
          background: theme.softBg,
          padding: '8px 24px',
          borderBottom: `1px dashed ${theme.softBorder}`
        }}
      >
        <Text style={{ fontFamily: 'monospace', fontSize: 12, color: theme.accentText }}>{ticket_number}</Text>
      </div>

      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
          <div>
            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>
              <CalendarOutlined /> &nbsp;Hari Layanan
            </Text>
            <Text strong style={{ color: theme.accentText }}>
              {day_name}
            </Text>
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>
              Status Tiket
            </Text>
            <Tag color={statusColor[status]} style={{ borderRadius: 20 }}>
              {status}
            </Tag>
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>
              <ClockCircleOutlined /> &nbsp;Tanggal Pengajuan
            </Text>
            <Text style={{ fontSize: 13 }}>{created_at}</Text>
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>
              Tipe Layanan
            </Text>
            <Text style={{ fontSize: 13 }}>{type}</Text>
          </div>
        </div>

        <Divider style={{ borderColor: theme.softBorder, margin: '16px 0' }} />

        <div>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
            Deskripsi Keluhan
          </Text>
          <div
            style={{
              background: '#fff',
              border: `1px solid ${theme.softBorder}`,
              borderRadius: 10,
              padding: '12px 16px',
              color: theme.accentText,
              fontSize: 13,
              lineHeight: 1.7,
              fontStyle: 'italic'
            }}
          >
            &quot;{desc}&quot;
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: `1px dashed ${theme.softBorder}`,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: theme.softBg
        }}
      >
        <HeartOutlined style={{ color: theme.accentText, fontSize: 13 }} />
        <Text style={{ fontSize: 11, color: theme.accentText, fontStyle: 'italic' }}>Kami siap mendengarkan dan mendampingimu 🌿</Text>
      </div>
    </div>
  );
}
